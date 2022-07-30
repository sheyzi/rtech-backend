import { ApiProperty } from '@nestjs/swagger';

export class ErrorSwaggerType {
  @ApiProperty({ example: '401', examples: [400, 401, 403, 404, 500] })
  statusCode: number;

  @ApiProperty({ description: 'What went wrong' })
  message: string;

  @ApiProperty({ description: 'error_type' })
  error: string;
}

export class NotFoundErrorSwaggerType extends ErrorSwaggerType {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Not found' })
  error: string;
}

export class UnauthorizedErrorSwaggerType extends ErrorSwaggerType {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}

export class BadRequestErrorSwaggerType extends ErrorSwaggerType {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad request' })
  error: string;
}

export class ConflictErrorSwaggerType extends ErrorSwaggerType {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Conflict' })
  error: string;
}
