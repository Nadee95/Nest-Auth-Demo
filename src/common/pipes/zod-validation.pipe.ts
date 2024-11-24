import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          metadata: metadata.type,
        }));
        throw new BadRequestException({
          message: 'Validation failed',
          errors: errorDetails,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
