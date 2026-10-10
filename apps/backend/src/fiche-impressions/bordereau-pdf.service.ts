
import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import type PDFKit from 'pdfkit';

import { Fiche } from '../fiches/entities/fiche.entity';

@Injectable()
export class BordereauPdfService {
  generer(fiche: Fiche): PDFKit.PDFDocument {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 28,
        bottom: 28,
        left: 32,
        right: 32,
      },
      bufferPages: true,
    });

    const left = 32;
    const right = doc.page.width - 32;
    const contentWidth = right - left;
    const colWidth = contentWidth / 2;

    // En-tête bilingue
    doc.font('Helvetica-Bold').fontSize(9);

    doc.text('RÉPUBLIQUE DU CAMEROUN', left, 30, {
      width: 220,
      align: 'center',
    });

    doc.text('REPUBLIC OF CAMEROON', right - 220, 30, {
      width: 220,
      align: 'center',
    });

    doc.font('Helvetica').fontSize(8);

    doc.text('Paix - Travail - Patrie', left, 44, {
      width: 220,
      align: 'center',
    });

    doc.text('Peace - Work - Fatherland', right - 220, 44, {
      width: 220,
      align: 'center',
    });

    doc.fontSize(7);

    doc.text(
      'Syndicat National des Chauffeurs professionnels des Transports du Cameroun',
      left,
      60,
      { width: 220, align: 'center' },
    );

    doc.text(
      'National Union of professional Drivers Transportation Cameroon',
      right - 220,
      60,
      { width: 220, align: 'center' },
    );

    doc.text(
      'Tél : +237 699 44 74 13 / 655 89 50 89 / 695 41 66 60',
      left,
      78,
      { width: 250, align: 'center' },
    );

    doc.text(
      'BP : 6180 Yaoundé-Cameroun',
      left,
      88,
      { width: 220, align: 'center' },
    );

    doc.moveTo(left, 105).lineTo(right, 105).stroke();

    // Titre et numéro officiel
    doc.font('Helvetica-Bold').fontSize(16);

    doc.text('BORDEREAU DE ROUTE', left, 115, {
      width: contentWidth,
      align: 'center',
    });

    doc.fontSize(13);

    doc.text(`N° ${fiche.numeroBordereau ?? ''}`, left, 138, {
      width: contentWidth,
      align: 'center',
    });

    // Informations du trajet
    const infoY = 166;

    doc.font('Helvetica').fontSize(9);

    doc.text(`Départ : ${fiche.gare?.nom ?? ''}`, left, infoY, {
      width: colWidth - 8,
    });

    doc.text(
      `Destination : ${fiche.destination?.nom ?? ''}`,
      left + colWidth,
      infoY,
      { width: colWidth },
    );

    doc.text(
      `Immatriculation : ${fiche.vehicule?.plaqueImmatriculation ?? ''}`,
      left,
      infoY + 20,
      { width: colWidth - 8 },
    );

    doc.text(
      `Chauffeur : ${fiche.chauffeur?.nom ?? ''} ${fiche.chauffeur?.prenom ?? ''}`,
      left + colWidth,
      infoY + 20,
      { width: colWidth },
    );

    doc.text(
      `Date : ${
        fiche.dateCreation
          ? new Date(fiche.dateCreation).toLocaleDateString('fr-FR')
          : ''
      }`,
      left,
      infoY + 40,
    );

    doc.text(
      `Heure de départ : ${
        fiche.heureDepart
          ? new Date(fiche.heureDepart).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '________'
      }`,
      left + colWidth,
      infoY + 40,
    );

    // Tableau des 15 passagers
    const tableTop = 230;
    const rowHeight = 23;

    const columns = [
      { title: 'N°', width: 25 },
      { title: 'Nom et prénom', width: 120 },
      { title: 'CNI', width: 90 },
      { title: 'Téléphone', width: 75 },
      { title: 'Tarif (FCFA)', width: 70 },
      { title: 'Observations', width: contentWidth - 380 },
    ];

    let x = left;

    doc.font('Helvetica-Bold').fontSize(7);

    for (const column of columns) {
      doc.rect(x, tableTop, column.width, rowHeight).stroke();

      doc.text(column.title, x + 3, tableTop + 7, {
        width: column.width - 6,
        align: 'center',
      });

      x += column.width;
    }

    doc.font('Helvetica').fontSize(7);

    let total = 0;

    for (let i = 0; i < 15; i++) {
      const y = tableTop + rowHeight * (i + 1);
      const item = fiche.fichePassagers?.[i];
      const passager = item?.passager;

      const tarif =
        item?.tarif !== null && item?.tarif !== undefined &&
        item.tarif !== ''
          ? Number(item.tarif)
          : null;

      if (tarif !== null && Number.isFinite(tarif)) {
        total += tarif;
      }

      const values = [
        String(i + 1),
        passager
          ? `${passager.nom ?? ''} ${passager.prenom ?? ''}`.trim()
          : '',
        passager?.numeroCni ?? '',
        passager?.telephone ?? '',
        tarif !== null && Number.isFinite(tarif)
          ? tarif.toLocaleString('fr-FR')
          : '',
        item?.observations ?? '',
      ];

      x = left;

      columns.forEach((column, index) => {
        doc.rect(x, y, column.width, rowHeight).stroke();

        doc.text(values[index], x + 3, y + 7, {
          width: column.width - 6,
          height: rowHeight - 5,
          ellipsis: true,
        });

        x += column.width;
      });
    }

    const totalY = tableTop + rowHeight * 16 + 8;

    doc.font('Helvetica-Bold').fontSize(9);

    doc.text(
      `TOTAL : ${total.toLocaleString('fr-FR')} FCFA`,
      left,
      totalY,
      { width: contentWidth, align: 'right' },
    );

    // Zones de signature
    const signatureY = totalY + 38;

    doc.font('Helvetica').fontSize(8);

    doc.text('Signature du Chauffeur', left, signatureY, {
      width: colWidth - 10,
      align: 'center',
    });

    doc.text(
      'Signature de la guichetiere',
      left + colWidth,
      signatureY,
      { width: colWidth, align: 'center' },
    );

    doc.moveTo(left + 15, signatureY + 55)
      .lineTo(left + colWidth - 15, signatureY + 55)
      .stroke();

    doc.moveTo(left + colWidth + 15, signatureY + 55)
      .lineTo(right - 15, signatureY + 55)
      .stroke();

    return doc;
  }
}
