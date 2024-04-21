#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsInfStack } from '../lib/aws_inf-stack';

const app = new cdk.App();
new AwsInfStack(app, 'AwsInfStack', {});
