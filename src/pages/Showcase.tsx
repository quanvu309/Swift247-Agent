import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ShowcaseScanDoc } from '../components/ShowcaseScanDoc';
import { Button } from '../components/ui/Button';

export function Showcase() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Control center"
        title="Showcase"
        description="The pickup gate reads the file before a truck leaves."
        actions={
          <Button asChild>
            <Link to="/design">
              Open Flow Design
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        } />

      <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            SAS sits between the shipper and SmartKargo. A light pass over the air waybill and
            invoice. Then a quiet decision: cleared, or needs ops.
          </p>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            The card is a demo. No live OCR. The same gate lives on the canvas.
          </p>
        </div>
        <ShowcaseScanDoc />
      </section>
    </div>
  );
}
