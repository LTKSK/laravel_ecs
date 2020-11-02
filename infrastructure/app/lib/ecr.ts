import * as cdk from '@aws-cdk/core';
import * as ecr from "@aws-cdk/aws-ecr";

export class EcrStack extends cdk.Stack {
  public readonly frontRepository: ecr.IRepository;
  public readonly backRepository: ecr.IRepository;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.frontRepository = new ecr.Repository(this, "LaravelFrontend", {
      repositoryName: "laravel-ecs-front"
    })
    this.backRepository = new ecr.Repository(this, "LaravelBackend", {
      repositoryName: "laravel-ecs-back"
    })
  }
}

