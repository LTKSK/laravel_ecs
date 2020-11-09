import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as rds from "@aws-cdk/aws-rds";

export interface Props {
  readonly vpc: ec2.IVpc;
}

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props & cdk.StackProps) {
    super(scope, id, props);

    const vpc = props.vpc;
    const db = new rds.DatabaseInstance(this, "LaravelRds", {
      vpc,
      engine: rds.DatabaseInstanceEngine.MYSQL,
      //cloudwatchLogsExports: ['slowquery']
    })
  }
}
