import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Usar DATABASE_URL si existe, de lo contrario usar variables individuales
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: {
              rejectUnauthorized: false,
            },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get<string>('NODE_ENV') !== 'production', // Auto-sync solo en desarrollo
            extra: {
              connectionLimit: 10, // Límite de conexiones para el pool
            }
          };
        }

        // Fallback a variables individuales si DATABASE_URL no está disponible
        return {
          type: 'postgres',
          host: configService.get<string>('PGHOST'),
          port: configService.get<number>('PGPORT'),
          username: configService.get<string>('PGUSER'),
          password: configService.get<string>('PGPASSWORD'),
          database: configService.get<string>('PGDATABASE'),
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          extra: {
            connectionLimit: 10,
          }
        };
      },
      inject: [ConfigService],
    }),
    
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}