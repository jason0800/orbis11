import { ReactFlowProvider } from '@xyflow/react';
import FlowArea from './components/FlowArea';
import '@xyflow/react/dist/style.css';
import './App.css'

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowArea />
    </ReactFlowProvider>
  ) 
}
