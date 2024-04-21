import * as cdk from 'aws-cdk-lib';
import { Port, Vpc } from 'aws-cdk-lib/aws-ec2';
import {
  Cluster,
  ContainerImage,
  FargateTaskDefinition,
  LogDriver,
} from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

export class AwsInfStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'UrlShortenerVPC', {
      maxAzs: 2,
    });

    const cluster = new Cluster(this, 'UrlShortenerCluster', {
      vpc,
    });

    const taskDefinition = new FargateTaskDefinition(
      this,
      'UrlShortenerTaskDef',
      {
        cpu: 256, // 0.25 vCPU
        memoryLimitMiB: 512, // 0.5 GB memory
      },
    );

    const container = taskDefinition.addContainer('UrlShortenerContainer', {
      image: ContainerImage.fromRegistry('ievgeniimasko/url_shortener'),
      logging: LogDriver.awsLogs({ streamPrefix: 'server-container' }),
    });

    container.addPortMappings({
      containerPort: 80,
    });

    const service = new ApplicationLoadBalancedFargateService(
      this,
      'UrlShortenerService',
      {
        cluster,
        taskDefinition,
        desiredCount: 2,
        publicLoadBalancer: true,
      },
    );

    service.service.connections.allowFromAnyIpv4(
      Port.tcp(80),
      'Allow inbound HTTP traffic',
    );
  }
}
