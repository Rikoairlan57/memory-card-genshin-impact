import { Main, Footer, Control } from "./components";

function App() {
  return (
    <div className="mx-4 flex min-h-screen flex-col items-center justify-center gap-8 py-10">
      <Main>
        <Control />
      </Main>
      <Footer />
    </div>
  );
}

export default App;
