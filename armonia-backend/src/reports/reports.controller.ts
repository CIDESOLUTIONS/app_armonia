import { Controller, Get, Query, Res, UseGuards, Req, Body } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(
  JwtAuthGuard,
  RolesGuard(
    UserRole.COMPLEX_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPTION,
    UserRole.STAFF,
  ),
)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('visitors/pdf')
  @Roles(
    UserRole.COMPLEX_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPTION,
    UserRole.STAFF,
  )
  async getVisitorsReportPdf(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateVisitorsReportPdf(
      req.user.schemaName,
      new Date(startDate),
      new Date(endDate),
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reporte_visitantes.pdf"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('visitors/excel')
  @Roles(
    UserRole.COMPLEX_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPTION,
    UserRole.STAFF,
  )
  async getVisitorsReportExcel(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateVisitorsReportExcel(
      req.user.schemaName,
      new Date(startDate),
      new Date(endDate),
    );
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="reporte_visitantes.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('packages/pdf')
  @Roles(
    UserRole.COMPLEX_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPTION,
    UserRole.STAFF,
  )
  async getPackagesReportPdf(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generatePackagesReportPdf(
      req.user.schemaName,
      new Date(startDate),
      new Date(endDate),
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reporte_paquetes.pdf"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('packages/excel')
  @Roles(
    UserRole.COMPLEX_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPTION,
    UserRole.STAFF,
  )
  async getPackagesReportExcel(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generatePackagesReportExcel(
      req.user.schemaName,
      new Date(startDate),
      new Date(endDate),
    );
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="reporte_paquetes.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('incidents/pdf')
  @Roles(
    UserRole.COMPLEX_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPTION,
    UserRole.STAFF,
  )
  async getIncidentsReportPdf(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateIncidentsReportPdf(
      req.user.schemaName,
      new Date(startDate),
      new Date(endDate),
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reporte_incidentes.pdf"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('incidents/excel')
  @Roles(
    UserRole.COMPLEX_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPTION,
    UserRole.STAFF,
  )
  async getIncidentsReportExcel(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateIncidentsReportExcel(
      req.user.schemaName,
      new Date(startDate),
      new Date(endDate),
    );
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="reporte_incidentes.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Post('consolidated-financial/pdf')
  @Roles(UserRole.ADMIN)
  async getConsolidatedFinancialReportPdf(
    @Body('schemaNames') schemaNames: string[],
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateConsolidatedFinancialReportPdf(
      schemaNames,
      new Date(startDate),
      new Date(endDate),
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reporte_financiero_consolidado.pdf"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}