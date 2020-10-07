import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('Upstream Engineering API')
        .setDescription(
            'REST API documentation for the Upstream Engineering Statistics',
        )
        .setVersion('0.0.1')
        .setSchemes('http', 'https')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('', app, document);
}
