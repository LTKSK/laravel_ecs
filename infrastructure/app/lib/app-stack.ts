import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "LaravelVpc", 
      { 
        cidr: "10.0.0.0/16",
        // 空にしないと自動で作られる
        subnetConfiguration: []
      }
    );
    // TODO: subnet作成
    const publicSubnet = new ec2.Subnet(this, "PublicSubnet", {
      availabilityZone: "ap-northeast-1a",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.1.0/24",
    })
    new ec2.Subnet(this, "PrivateSubnet", {
      availabilityZone: "ap-northeast-1a",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.2.0/24",
    })

    // igw作って、VPCとpublic subnetのroutetableに設定
    const internetGateway = new ec2.CfnInternetGateway(this, "LaravelInternetGateway", {});
    // ここがアタッチの処理
    new ec2.CfnVPCGatewayAttachment(this, "LaravelGateway", {
      vpcId: vpc.vpcId,
      internetGatewayId: internetGateway.ref
    })
    publicSubnet.addRoute("PubSubnetRoute", {
      routerType: ec2.RouterType.GATEWAY,
      routerId: internetGateway.ref
    })

    // TODO: taskDefinitionとALBだけどそこはまだpatternsを使う?

    //const cluster = new ecs.Cluster(this, "MyCluster", { vpc, clusterName: "MyCluster" })
    //const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDefinition");
    //const container = taskDefinition.addContainer("MyContainer", {
    //  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
    //});
    //container.addPortMappings({ containerPort: 80 });
    //const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService",{
    //  cluster,
    //  cpu: 256,
    //  desiredCount: 1,
    //  memoryLimitMiB: 1024,
    //  publicLoadBalancer: true,
    //  taskDefinition
    //});
    //new cdk.CfnOutput(this, 'LoadBalancerDNS', {value: fargateService.loadBalancer.loadBalancerDnsName});
  }
}
