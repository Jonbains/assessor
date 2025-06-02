/**
 * Assessment Framework - Base Chart Component
 * 
 * Provides foundation for chart visualizations in assessment results
 * Depends on Chart.js library
 */

export class ChartBase {
    /**
     * Constructor for the base chart component
     * @param {Object} options - Chart configuration
     * @param {String} options.canvasId - ID for the canvas element
     * @param {Object} options.data - Data for the chart
     * @param {Object} options.config - Chart.js configuration options
     */
    constructor(options) {
        this.canvasId = options.canvasId;
        this.data = options.data || {};
        this.config = options.config || {};
        this.chart = null;
    }
    
    /**
     * Initialize the chart
     * @return {Object} - The created chart instance
     */
    initialize() {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('[ChartBase] Chart.js library is not loaded');
            return null;
        }
        
        // Get the canvas element
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) {
            console.error(`[ChartBase] Canvas with ID '${this.canvasId}' not found`);
            return null;
        }
        
        try {
            // Create the chart
            this.chart = new Chart(canvas, {
                type: this.getChartType(),
                data: this.getChartData(),
                options: this.getChartOptions()
            });
            
            return this.chart;
        } catch (error) {
            console.error('[ChartBase] Error initializing chart:', error);
            return null;
        }
    }
    
    /**
     * Get the chart type
     * @return {String} - Chart type (e.g., 'bar', 'radar', 'pie')
     */
    getChartType() {
        // To be implemented by subclasses
        return this.config.type || 'bar';
    }
    
    /**
     * Get the chart data
     * @return {Object} - Chart data object
     */
    getChartData() {
        // To be implemented by subclasses
        return this.data;
    }
    
    /**
     * Get chart options
     * @return {Object} - Chart.js options object
     */
    getChartOptions() {
        // To be implemented by subclasses
        return this.config.options || {};
    }
    
    /**
     * Update the chart data and redraw
     * @param {Object} newData - New data for the chart
     */
    updateData(newData) {
        if (!this.chart) {
            console.error('[ChartBase] Chart not initialized');
            return;
        }
        
        this.data = newData;
        this.chart.data = this.getChartData();
        this.chart.update();
    }
    
    /**
     * Update chart options and redraw
     * @param {Object} newOptions - New options for the chart
     */
    updateOptions(newOptions) {
        if (!this.chart) {
            console.error('[ChartBase] Chart not initialized');
            return;
        }
        
        this.config.options = {
            ...this.config.options,
            ...newOptions
        };
        
        this.chart.options = this.getChartOptions();
        this.chart.update();
    }
    
    /**
     * Destroy the chart instance
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
    
    /**
     * Create the canvas element if it doesn't exist
     * @param {String} containerId - ID of the container element
     * @param {String} canvasId - ID to give the new canvas
     * @return {HTMLElement} - The canvas element
     */
    static createCanvas(containerId, canvasId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[ChartBase] Container with ID '${containerId}' not found`);
            return null;
        }
        
        // Check if canvas already exists
        let canvas = document.getElementById(canvasId);
        if (canvas) {
            return canvas;
        }
        
        // Create new canvas
        canvas = document.createElement('canvas');
        canvas.id = canvasId;
        container.appendChild(canvas);
        
        return canvas;
    }
}
