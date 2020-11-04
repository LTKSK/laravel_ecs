import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "LaravelVpc", {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      // 空にしないとNAT込で自動で作られる
      //subnetConfiguration: [
      //  {
      //    cidrMask: 24,
      //    name: "Public",
      //    subnetType: ec2.SubnetType.PUBLIC,
      //  },
      //{
      //  cidrMask: 24,
      //  name: "Private",
      //  subnetType: ec2.SubnetType.PRIVATE
      //},
      //],
    });
  }
}
