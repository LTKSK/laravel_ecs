import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import * as logs from "@aws-cdk/aws-logs";

export interface Props {
  readonly vpc: ec2.IVpc;
}

export class EcsStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props?: Props & cdk.StackProps
  ) {
    super(scope, id, props);

    const vpc = props?.vpc;
    if (!vpc) {
      throw new ReferenceError("vpc not found in props");
    }

    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc,
      clusterName: "MyCluster",
    });
    const logGroup = new logs.LogGroup(this, "LaravelEcsLogGroup", {
      logGroupName: "laravel-ecs-log-group",
    });

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "TaskDefinition",
      {
        family: "laravel-ecs",
      }
    );
    const container = taskDefinition.addContainer("MyContainer", {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      logging: new ecs.AwsLogDriver({ streamPrefix: "LaravelEcs", logGroup }),
      memoryLimitMiB: 256,
    });
    container.addPortMappings({ containerPort: 80 });
    const ecsService = new ecs.FargateService(this, "LaravelService", {
      cluster,
      taskDefinition,
      desiredCount: 1,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      // TODO
      // subnet指定とsgの指定?
    });
    const lb = new elb.ApplicationLoadBalancer(this, "LaravelALB", {
      vpc,
      internetFacing: true,
    });
    const listener = lb.addListener("LaravelListener", { port: 80 });
    listener.addTargets("LaravelEcsTG", {
      port: 80,
      targets: [ecsService],
    });

    //const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
    //  this,
    //  "MyFargateService",
    //  {
    //    cluster,
    //    cpu: 256,
    //    desiredCount: 1,
    //    memoryLimitMiB: 1024,
    //    publicLoadBalancer: true,
    //    taskDefinition
    //  }
    //);
    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: lb.loadBalancerDnsName,
    });
  }
}
