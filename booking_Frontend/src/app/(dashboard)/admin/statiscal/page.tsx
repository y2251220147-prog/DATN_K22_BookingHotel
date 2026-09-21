import MiniStatsChat from "../../components/statistical/MiniStatsChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingDashboard from "../../components/statistical/PricingDashboard";
export default function Page() {
  return (
    <Tabs defaultValue="statiscal">
      <TabsList variant="line">
        <TabsTrigger value="statiscal">thống kê</TabsTrigger>
        <TabsTrigger value="analytics">phân tích</TabsTrigger>
      </TabsList>
      <TabsContent value="statiscal">
        <MiniStatsChat />
      </TabsContent>
      <TabsContent value="analytics">
        <PricingDashboard />
      </TabsContent>
    </Tabs>
  );
}
