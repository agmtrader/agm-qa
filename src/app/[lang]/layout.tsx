import "../globals.css"
import { TranslationProvider } from "../../utils/providers/TranslationProvider"

export default async function Layout(
  props: Readonly<{
    children: React.ReactNode
    params:Promise<{lang:string}>
  }>
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const {
    children
  } = props;

  return (
    <TranslationProvider lang={lang}>
      {children}
    </TranslationProvider>
  )
}