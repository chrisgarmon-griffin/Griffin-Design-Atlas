import { cn } from "cn"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Sign up with Apple</span>
                </Button>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Sign up with Google</span>
                </Button>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Sign up with Meta</span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <a href="#">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9IiNFQUVBRUEiIHJ4PSIzIi8+PGcgb3BhY2l0eT0iLjUiPjxnIG9wYWNpdHk9Ii41Ij48cGF0aCBmaWxsPSIjRkFGQUZBIiBkPSJNNjAwLjcwOSA3MzYuNWMtNzUuNDU0IDAtMTM2LjYyMS02MS4xNjctMTM2LjYyMS0xMzYuNjIgMC03NS40NTQgNjEuMTY3LTEzNi42MjEgMTM2LjYyMS0xMzYuNjIxIDc1LjQ1MyAwIDEzNi42MiA2MS4xNjcgMTM2LjYyIDEzNi42MjEgMCA3NS40NTMtNjEuMTY3IDEzNi42Mi0xMzYuNjIgMTM2LjYyWiIvPjxwYXRoIHN0cm9rZT0iI0M5QzlDOSIgc3Ryb2tlLXdpZHRoPSIyLjQxOCIgZD0iTTYwMC43MDkgNzM2LjVjLTc1LjQ1NCAwLTEzNi42MjEtNjEuMTY3LTEzNi42MjEtMTM2LjYyIDAtNzUuNDU0IDYxLjE2Ny0xMzYuNjIxIDEzNi42MjEtMTM2LjYyMSA3NS40NTMgMCAxMzYuNjIgNjEuMTY3IDEzNi42MiAxMzYuNjIxIDAgNzUuNDUzLTYxLjE2NyAxMzYuNjItMTM2LjYyIDEzNi42MloiLz48L2c+PHBhdGggc3Ryb2tlPSJ1cmwoI2EpIiBzdHJva2Utd2lkdGg9IjIuNDE4IiBkPSJNMC0xLjIwOWg1NTMuNTgxIiB0cmFuc2Zvcm09InNjYWxlKDEgLTEpIHJvdGF0ZSg0NSAxMTYzLjExIDkxLjE2NSkiLz48cGF0aCBzdHJva2U9InVybCgjYikiIHN0cm9rZS13aWR0aD0iMi40MTgiIGQ9Ik00MDQuODQ2IDU5OC42NzFoMzkxLjcyNiIvPjxwYXRoIHN0cm9rZT0idXJsKCNjKSIgc3Ryb2tlLXdpZHRoPSIyLjQxOCIgZD0iTTU5OS41IDc5NS43NDJWNDA0LjAxNyIvPjxwYXRoIHN0cm9rZT0idXJsKCNkKSIgc3Ryb2tlLXdpZHRoPSIyLjQxOCIgZD0ibTc5NS43MTcgNzk2LjU5Ny0zOTEuNDQxLTM5MS40NCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik02MDAuNzA5IDY1Ni43MDRjLTMxLjM4NCAwLTU2LjgyNS0yNS40NDEtNTYuODI1LTU2LjgyNCAwLTMxLjM4NCAyNS40NDEtNTYuODI1IDU2LjgyNS01Ni44MjUgMzEuMzgzIDAgNTYuODI0IDI1LjQ0MSA1Ni44MjQgNTYuODI1IDAgMzEuMzgzLTI1LjQ0MSA1Ni44MjQtNTYuODI0IDU2LjgyNFoiLz48ZyBjbGlwLXBhdGg9InVybCgjZSkiPjxwYXRoIGZpbGw9IiM2NjYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTYxNi40MjYgNTg2LjU4aC0zMS40MzR2MTYuMTc2bDMuNTUzLTMuNTU0LjUzMS0uNTMxaDkuMDY4bC4wNzQtLjA3NCA4LjQ2My04LjQ2M2gyLjU2NWw3LjE4IDcuMTgxVjU4Ni41OFptLTE1LjcxNSAxNC42NTQgMy42OTggMy42OTkgMS4yODMgMS4yODItMi41NjUgMi41NjUtMS4yODItMS4yODMtNS4yLTUuMTk5aC02LjA2NmwtNS41MTQgNS41MTQtLjA3My4wNzN2Mi44NzZhMi40MTggMi40MTggMCAwIDAgMi40MTggMi40MThoMjYuNTk4YTIuNDE4IDIuNDE4IDAgMCAwIDIuNDE4LTIuNDE4di04LjMxN2wtOC40NjMtOC40NjMtNy4xODEgNy4xODEtLjA3MS4wNzJabS0xOS4zNDcgNS40NDJ2NC4wODVhNi4wNDUgNi4wNDUgMCAwIDAgNi4wNDYgNi4wNDVoMjYuNTk4YTYuMDQ0IDYuMDQ0IDAgMCAwIDYuMDQ1LTYuMDQ1di03LjEwOGwxLjM1Ni0xLjM1NS0xLjI4Mi0xLjI4My0uMDc0LS4wNzN2LTE3Ljk4OWgtMzguNjg5djIzLjQzbC0uMTQ2LjE0Ni4xNDYuMTQ3WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9nPjxwYXRoIHN0cm9rZT0iI0M5QzlDOSIgc3Ryb2tlLXdpZHRoPSIyLjQxOCIgZD0iTTYwMC43MDkgNjU2LjcwNGMtMzEuMzg0IDAtNTYuODI1LTI1LjQ0MS01Ni44MjUtNTYuODI0IDAtMzEuMzg0IDI1LjQ0MS01Ni44MjUgNTYuODI1LTU2LjgyNSAzMS4zODMgMCA1Ni44MjQgMjUuNDQxIDU2LjgyNCA1Ni44MjUgMCAzMS4zODMtMjUuNDQxIDU2LjgyNC01Ni44MjQgNTYuODI0WiIvPjwvZz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSI1NTQuMDYxIiB4Mj0iLS40OCIgeTE9Ii4wODMiIHkyPSIuMDg3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0M5QzlDOSIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIuMjA4IiBzdG9wLWNvbG9yPSIjQzlDOUM5Ii8+PHN0b3Agb2Zmc2V0PSIuNzkyIiBzdG9wLWNvbG9yPSIjQzlDOUM5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQzlDOUM5IiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9Ijc5Ni45MTIiIHgyPSI0MDQuNTA3IiB5MT0iNTk5Ljk2MyIgeTI9IjU5OS45NjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjQzlDOUM5IiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii4yMDgiIHN0b3AtY29sb3I9IiNDOUM5QzkiLz48c3RvcCBvZmZzZXQ9Ii43OTIiIHN0b3AtY29sb3I9IiNDOUM5QzkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNDOUM5QzkiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iNjAwLjc5MiIgeDI9IjYwMC43OTQiIHkxPSI0MDMuNjc3IiB5Mj0iNzk2LjA4MiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNDOUM5QzkiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iLjIwOCIgc3RvcC1jb2xvcj0iI0M5QzlDOSIvPjxzdG9wIG9mZnNldD0iLjc5MiIgc3RvcC1jb2xvcj0iI0M5QzlDOSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0M5QzlDOSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImQiIHgxPSI0MDQuODUiIHgyPSI3OTYuOTcyIiB5MT0iNDAzLjkwMyIgeTI9Ijc5Ni4wMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNDOUM5QzkiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iLjIwOCIgc3RvcC1jb2xvcj0iI0M5QzlDOSIvPjxzdG9wIG9mZnNldD0iLjc5MiIgc3RvcC1jb2xvcj0iI0M5QzlDOSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0M5QzlDOSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGggaWQ9ImUiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01ODEuMzY0IDU4MC41MzVoMzguNjg5djM4LjY4OWgtMzguNjg5eiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg=="
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
