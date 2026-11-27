import { Request, Response, NextFunction } from 'express';
import { importService } from '../services/import.service.js';

export class ImportController {
  async importOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let rows: any[] = [];

      if (Array.isArray(req.body)) {
        rows = req.body;
      } else if (req.body.orders && Array.isArray(req.body.orders)) {
        rows = req.body.orders;
      } else if (typeof req.body.csvString === 'string') {
        // Parse CSV string into rows
        const lines = req.body.csvString.trim().split('\n');
        if (lines.length > 1) {
          const headers = lines[0].split(',').map((h: string) => h.trim());
          rows = lines.slice(1).map((line: string) => {
            const values = line.split(',').map((v: string) => v.trim());
            const obj: Record<string, string> = {};
            headers.forEach((h: string, i: number) => {
              obj[h] = values[i] || '';
            });
            return obj;
          });
        }
      }

      if (rows.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No order rows found to import. Provide an array of orders or csvString.',
        });
        return;
      }

      const result = await importService.importOrdersFromRows(rows);
      res.status(200).json({
        success: true,
        message: `Successfully imported ${result.importedCount} orders.`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const template = importService.getSampleCsvTemplate();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="blinkit_orders_template.csv"');
      res.status(200).send(template);
    } catch (err) {
      next(err);
    }
  }
}

export const importController = new ImportController();
