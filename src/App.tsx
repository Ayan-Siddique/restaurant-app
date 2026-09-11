import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import GlobalToast from "./components/common/GlobalToast";

const App = () => {
  return (
    <>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
      <GlobalToast />
    </>
  );
};

export default App;