import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PipelineHero } from '../components/PipelineHero';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Separator } from '../components/ui/Separator';
import { flows, type FlowSummary } from '../data/flows';
import { flowsLandingContent } from '../data/flowsLanding';

const statusBadge = {
  active: { label: 'Live', variant: 'default' },
  paused: { label: 'Paused', variant: 'secondary' },
  draft: { label: 'Draft', variant: 'outline' }
} as const satisfies Record<FlowSummary['status'], { label: string; variant: 'default' | 'secondary' | 'outline' }>;

export function Flows() {
  const content = flowsLandingContent;
  const featured = flows[0];
  const rest = flows.slice(1);

  return (
    <div className="sas-landing flex flex-col">
      <section className="px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col gap-5">
              <h1 className="font-heading max-w-[14ch] text-[2.45rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.65rem]">
                {content.hero.heading}
              </h1>
              <p className="max-w-md text-base leading-7 text-muted-foreground">{content.hero.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link to="/design?flow=full">
                  {content.hero.primaryActionLabel}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="#how">{content.hero.processActionLabel}</a>
              </Button>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">{content.hero.supportingLine}</p>
          </div>
          <PipelineHero steps={content.process} />
        </div>
      </section>

      <Separator />

      <section aria-labelledby="value-heading" className="px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
          <div className="flex max-w-xl flex-col gap-4">
            <h2 id="value-heading" className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {content.value.intro.heading}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">{content.value.intro.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.value.items.map((item) =>
            <Card key={item.title} className="h-full">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">{item.title}</CardTitle>
                  <CardDescription className="leading-6">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section id="how" aria-labelledby="how-heading" className="scroll-mt-20 bg-muted/50 px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-12">
          <div className="flex max-w-xl flex-col gap-4">
            <h2 id="how-heading" className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {content.how.heading}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">{content.how.description}</p>
          </div>
          <ol className="relative grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            <Separator className="absolute left-0 right-0 top-5 hidden xl:block" />
            {content.process.map((step) =>
            <li key={step.order} className="relative flex flex-col gap-3">
                <span className="relative z-[1] flex size-10 items-center justify-center rounded-full border border-border bg-background text-xs font-medium tabular-nums text-foreground">
                  0{step.order}
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
              </li>
            )}
          </ol>
        </div>
      </section>

      <Separator />

      <section id="lanes" aria-labelledby="lanes-heading" className="px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex max-w-xl flex-col gap-4">
              <h2 id="lanes-heading" className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {content.lanes.heading}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">{content.lanes.description}</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/design">Open Flow Design</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {featured ?
            <Card>
                <div className="flex flex-col lg:flex-row">
                  <div className="flex min-w-0 flex-1 flex-col">
                    <CardHeader>
                      <Badge variant={statusBadge[featured.status].variant}>
                        {statusBadge[featured.status].label}
                      </Badge>
                      <CardTitle className="font-heading text-2xl md:text-3xl">{featured.name}</CardTitle>
                      <CardDescription className="max-w-md leading-6">{featured.promise}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-foreground">{featured.outcome}</p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button asChild>
                        <Link to={`/design?flow=${featured.id}`}>
                          Open this flow
                          <ArrowRight aria-hidden="true" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                  <Separator className="lg:hidden" />
                  <Separator orientation="vertical" className="hidden min-h-full lg:block" />
                  <CardContent className="flex min-w-0 flex-1 flex-col justify-center gap-4 p-6">
                    <ol className="flex flex-col gap-2">
                      {featured.steps.map((step, index) =>
                      <li key={step} className="flex items-baseline gap-3 text-sm text-foreground">
                          <span className="w-6 text-xs tabular-nums text-muted-foreground">0{index + 1}</span>
                          {step}
                        </li>
                      )}
                    </ol>
                    <p className="text-xs leading-5 text-muted-foreground">
                      {featured.trigger}. {featured.channels.join(', ')}.
                    </p>
                  </CardContent>
                </div>
              </Card> :
            null}

            <Card>
              <ul>
                {rest.map((flow, index) =>
                <li key={flow.id}>
                    {index > 0 ? <Separator /> : null}
                    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-8">
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">{flow.name}</h3>
                          <Badge variant={statusBadge[flow.status].variant}>
                            {statusBadge[flow.status].label}
                          </Badge>
                        </div>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{flow.promise}</p>
                        <p className="text-sm text-foreground">{flow.outcome}</p>
                      </div>
                      <Button variant="outline" asChild className="shrink-0">
                        <Link to={`/design?flow=${flow.id}`}>Open this flow</Link>
                      </Button>
                    </div>
                  </li>
                )}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-primary px-5 py-16 text-primary-foreground md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{content.closer.heading}</h2>
            <p className="text-sm leading-6 text-primary-foreground/80">{content.closer.description}</p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/design?flow=full">
              {content.closer.actionLabel}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
