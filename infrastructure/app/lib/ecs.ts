import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as logs from "@aws-cdk/aws-logs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as iam from "@aws-cdk/aws-iam";

export interface Props {
  readonly vpc: ec2.IVpc;
  readonly repository: ecr.IRepository;
}

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props & cdk.StackProps) {
    super(scope, id, props);
    const {vpc} = props;
    const cluster = new ecs.Cluster(this, "LaravelCluster", {
      vpc,
      clusterName: "LaravelCluster",
    });

    const logGroup = new logs.LogGroup(this, "LaravelEcsLogGroup", {
      logGroupName: "laravel-ecs-log-group",
    });

    const executionRole = new iam.Role(this, "LaravelEcsTaskExecutionRole", {
      roleName: "laravel-ecs-task-execution-role",
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        ),
      ],
    });

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "LaravelTaskDefinition",
      { family: "laravelTasks", executionRole }
    );
    const webContainer = taskDefinition.addContainer("webContainer", {
      // 実際の運用で更新する時はtaskDefinitionのrepositoryのtagを更新する
      image: ecs.ContainerImage.fromEcrRepository(props.repository, "web"),
      logging: new ecs.AwsLogDriver({
        streamPrefix: "LaravelEcs/web", logGroup
      }),
    
    });
    webContainer.addPortMappings({ containerPort: 80 });

    const appContainer = taskDefinition.addContainer("appContainer", {
      image: ecs.ContainerImage.fromEcrRepository(props.repository, "app"),
      logging: new ecs.AwsLogDriver({
        streamPrefix: "LaravelEcs/front", logGroup
      }),
    });
    // nginxはappが動いてから起動
    webContainer.addContainerDependencies(
      {
        container: appContainer, 
        condition: ecs.ContainerDependencyCondition.START
      }
    )

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
      }
    );

    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}
