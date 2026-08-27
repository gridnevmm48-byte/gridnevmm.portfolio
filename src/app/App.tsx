import Root from "./components/Root";
import { LangProvider } from "./i18n";

// One page, so no router: the shell renders the page directly. The header's
// jump links are plain anchors, which need no routing of their own.
export default function App() {
  return (
    <LangProvider>
      <Root />
    </LangProvider>
  );
}
