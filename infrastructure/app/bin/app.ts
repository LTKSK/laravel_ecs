#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../lib/vpc';
import { EcrStack } from '../lib/ecr';
import { EcsStack } from '../lib/ecs';

const app = new cdk.App();
const vpcStack = new VpcStack(app, 'VpcStack');
//new EcrStack(app, "EcrStack");
new EcsStack(app, "EcsStack", {vpc: vpcStack.vpc})

