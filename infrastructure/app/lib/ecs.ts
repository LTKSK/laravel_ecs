import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
//import * as logs from "@aws-cdk/aws-logs";
import * as iam from "@aws-cdk/aws-iam";

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

    const cluster = new ecs.Cluster(this, "LaravelCluster", {
      vpc,
      clusterName: "LaravelCluster",
    });
    //const logGroup = new logs.LogGroup(this, "LaravelEcsLogGroup", {
    //  logGroupName: "laravel-ecs-log-group",
    //});

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "LaravelTaskDefinition",
      { family: "laravelTasks" }
    );
    const container = taskDefinition.addContainer("MyContainer", {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      logging: new ecs.AwsLogDriver({
        streamPrefix: "LaravelEcs", //logGroup
      }),
    });
    container.addPortMappings({ containerPort: 80 });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "LaravelFargateService",
      {
        cluster,
        taskDefinition,
        cpu: 256,
        desiredCount: 1,
        memoryLimitMiB: 512,
        publicLoadBalancer: true,
        // taskImageOptions: {image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")},
      }
    );

    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}
