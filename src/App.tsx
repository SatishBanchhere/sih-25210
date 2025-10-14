import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import DigitalTwin from "./pages/DigitalTwin";
import Maintainance from "./pages/Maintainance";
import Renewable from "./pages/Renewable";
import SimulationTool from "./pages/SimulationTool";
import Energy from "./pages/Energy";
import IoTSensors from "./pages/IoTSensors";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/maintainance" element={<Maintainance />} />
            <Route path="/renewable" element={<Renewable />} />
            <Route path="/simulation-tool" element={<SimulationTool />} />
            <Route path="/energy" element={<Energy />} />
            <Route path="/iot-sensors" element={<IoTSensors />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
