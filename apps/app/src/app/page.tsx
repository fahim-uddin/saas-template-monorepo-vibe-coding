import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Progress } from "@repo/ui/components/progress";
import { Separator } from "@repo/ui/components/separator";
import { Switch } from "@repo/ui/components/switch";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background px-4 py-16 font-sans">
      <div className="flex w-full max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="font-semibold text-xl tracking-tight">
            Shared UI Component Showcase
          </h1>
          <p className="text-muted-foreground text-sm">
            All components below are imported from{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              @repo/ui
            </code>{" "}
            &mdash; the shared shadcn/ui package powered by Base UI primitives.
          </p>
        </header>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-sm">Buttons</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button">Default</Button>
            <Button type="button" variant="outline">
              Outline
            </Button>
            <Button type="button" variant="secondary">
              Secondary
            </Button>
            <Button type="button" variant="ghost">
              Ghost
            </Button>
            <Button type="button" variant="destructive">
              Destructive
            </Button>
            <Button type="button" variant="link">
              Link
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="xs" type="button">
              Extra Small
            </Button>
            <Button size="sm" type="button">
              Small
            </Button>
            <Button size="default" type="button">
              Default
            </Button>
            <Button size="lg" type="button">
              Large
            </Button>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-sm">Badges</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-sm">Input &amp; Label</h2>
          <div className="flex max-w-sm flex-col gap-2">
            <Label htmlFor="demo-email">Email</Label>
            <Input id="demo-email" placeholder="you@example.com" type="email" />
          </div>
          <div className="flex max-w-sm flex-col gap-2">
            <Label htmlFor="demo-password">Password</Label>
            <Input
              id="demo-password"
              placeholder="Enter your password"
              type="password"
            />
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-sm">Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Alpha</CardTitle>
                <CardDescription>
                  A modern web application built with Next.js and shadcn/ui.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" type="button" variant="outline">
                  View Details
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardAction>
                  <Badge>3 new</Badge>
                </CardAction>
                <CardDescription>
                  You have unread notifications from this week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs">
                  Deployment succeeded, 2 pull requests merged, and 1 new
                  comment on your issue.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" type="button">
                  Mark all read
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-sm">Card (Small Variant)</h2>
          <Card className="max-w-sm" size="sm">
            <CardHeader>
              <CardTitle>Compact Card</CardTitle>
              <CardDescription>
                Uses the &ldquo;sm&rdquo; size prop for tighter spacing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Label htmlFor="card-input">Quick Note</Label>
                <Input id="card-input" placeholder="Type something..." />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm" type="button">
                Save
              </Button>
              <Button size="sm" type="button" variant="outline">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-sm">Switch</h2>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-sm">Progress</h2>
          <Progress className="w-[60%]" value={60} />
        </section>
      </div>
    </div>
  );
}
