import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  isDarkTheme?: boolean;
}

export function Mermaid({ chart, isDarkTheme = false }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize mermaid with theme configuration
    mermaid.initialize({
      startOnLoad: true,
      theme: isDarkTheme ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    });

    const renderDiagram = async () => {
      try {
        // Clean the chart string by removing markdown code fences and extra content
        const cleanChart = chart
          ?.split('```mermaid')[1]              // Get content after mermaid declaration
          ?.split('```')[0]                     // Remove anything after closing ```
          ?.trim() || '';                       // Trim whitespace and provide default

        // Log the cleaned chart for debugging
        console.log('Cleaned chart:', cleanChart);

        if (!cleanChart && containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 rounded-lg ${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}">
              <p>No diagram available</p>
            </div>
          `;
          return;
        }

        // Ensure the chart starts with graph or flowchart
        const formattedChart = cleanChart.trim().startsWith('graph') || cleanChart.trim().startsWith('flowchart')
          ? cleanChart
          : `graph TB\n${cleanChart}`;

        // Generate unique ID for the diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        const { svg } = await mermaid.render(id, formattedChart);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Add theme-specific styles to SVG
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.borderRadius = '0.5rem';
            svgElement.style.padding = '1rem';
            svgElement.style.backgroundColor = isDarkTheme ? '#1f2937' : '#f9fafb';
            
            // Make SVG responsive
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.maxWidth = '100%';
            
            // Add smooth theme transition
            svgElement.style.transition = 'background-color 0.3s ease';
          }
        }
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 rounded-lg ${isDarkTheme ? 'bg-red-900/10 text-red-200' : 'bg-red-50 text-red-500'}">
              <p class="font-medium mb-2">Error rendering diagram</p>
              <div class="space-y-2">
                <p class="text-sm">Please ensure the diagram follows Mermaid syntax:</p>
                <pre class="text-xs bg-black/10 p-2 rounded overflow-auto">${chart}</pre>
                <p class="text-xs opacity-75">${error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [chart, isDarkTheme]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto rounded-lg transition-colors duration-200"
    />
  );
} 