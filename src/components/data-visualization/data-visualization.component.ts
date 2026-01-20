import { Component, ChangeDetectionStrategy, signal, computed, ViewChild, ElementRef, afterNextRender, effect, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';

type ChartType = 'bar' | 'scatter';
type RawData = { [key: string]: any };

@Component({
  selector: 'app-data-visualization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-visualization.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataVisualizationComponent {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  data: WritableSignal<RawData[]> = signal([]);
  headers = computed(() => (this.data().length > 0 ? Object.keys(this.data()[0]) : []));
  
  chartType = signal<ChartType>('bar');
  
  // Signals for axis selections
  barCategory = signal<string>('');
  barValue = signal<string>('');
  scatterX = signal<string>('');
  scatterY = signal<string>('');

  error = signal<string>('');

  constructor() {
    afterNextRender(() => {
      this.loadSampleData();
    });

    // Effect to re-render chart when data or selections change
    effect(() => {
      // This effect depends on signals that are changed by user interaction.
      // D3 needs a rendered DOM element, so we ensure this runs after the view is stable.
      if (this.data().length > 0 && this.chartContainer) {
        this.renderChart();
      }
    });
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.error.set('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        this.parseCSV(csvContent);
      } catch (err) {
        this.error.set('فشل في قراءة الملف. يرجى التأكد من أنه ملف CSV صالح.');
      }
    };
    reader.onerror = () => {
       this.error.set('حدث خطأ أثناء قراءة الملف.');
    };
    reader.readAsText(file);
  }

  private parseCSV(csvContent: string) {
    let parsedData = d3.csvParse(csvContent);
    
    // Auto-convert numeric strings to numbers
    if (parsedData.length > 0) {
      const keys = parsedData.columns;
      parsedData = parsedData.map(row => {
        const newRow: RawData = {};
        for (const key of keys) {
          const value = row[key] as string;
          // A simple check for numeric values (handles integers and floats)
          newRow[key] = !isNaN(Number(value)) && value.trim() !== '' ? Number(value) : value;
        }
        return newRow;
      });
    }

    this.data.set(parsedData);
    // Set default axes
    if (this.headers().length >= 2) {
      this.barCategory.set(this.headers()[0]);
      this.barValue.set(this.headers()[1]);
      this.scatterX.set(this.headers()[0]);
      this.scatterY.set(this.headers()[1]);
    }
  }
  
  private renderChart() {
    const svgElement = this.chartContainer.nativeElement;
    d3.select(svgElement).selectAll('*').remove(); // Clear previous render

    if (this.chartType() === 'bar') {
      this.drawBarChart();
    } else if (this.chartType() === 'scatter') {
      this.drawScatterPlot();
    }
  }

  private drawBarChart() {
    const category = this.barCategory();
    const value = this.barValue();
    if (!category || !value || this.data().length === 0) return;

    const data = this.data();
    const margin = { top: 20, right: 30, bottom: 80, left: 60 };
    const width = this.chartContainer.nativeElement.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(this.chartContainer.nativeElement)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d[category]))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[value]) as number])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g').call(d3.axisLeft(y));

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d[category]) as number)
      .attr('y', d => y(d[value]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[value]))
      .attr('fill', '#0D2B6B');
  }

  private drawScatterPlot() {
    const xKey = this.scatterX();
    const yKey = this.scatterY();
    if (!xKey || !yKey || this.data().length === 0) return;

    const data = this.data();
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = this.chartContainer.nativeElement.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(this.chartContainer.nativeElement)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[xKey]) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[yKey]) as [number, number])
      .range([height, 0]);

    svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));
    
    // Add a tooltip div
    const tooltip = d3.select('body').append('div')
        .attr('class', 'absolute p-2 text-xs bg-gray-800 text-white rounded-md opacity-0 pointer-events-none');

    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d[xKey]))
      .attr('cy', d => y(d[yKey]))
      .attr('r', 5)
      .attr('fill', '#F2C000')
      .on('mouseover', (event, d) => {
          tooltip.transition().duration(200).style('opacity', .9);
          tooltip.html(`${xKey}: ${d[xKey]}<br/>${yKey}: ${d[yKey]}`)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
          tooltip.transition().duration(500).style('opacity', 0);
      });
  }
  
  loadSampleData() {
    const sampleCSV = `governorate,population_2023,idps_2023\nأمانة العاصمة,3293000,201000\nصنعاء,1109000,545000\nعدن,1093000,169000\nالحديدة,3289000,677000\nتعز,3047000,490000\nإب,2719000,283000\nحجة,2019000,432000\nذمار,1716000,172000\nمأرب,340000,1053000`;
    this.parseCSV(sampleCSV);
  }
}
