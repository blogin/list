import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Список покупок</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Rewrite v2 — каркас готов. Следующие итерации: domain, Firebase, auth, UI.
          </p>
          <Button className="w-full">Оранжевая тема new-york</Button>
        </CardContent>
      </Card>
      <Toaster richColors position="top-center" />
    </div>
  )
}
