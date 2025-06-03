/**
 * ResultsAdapterFactory
 * Creates and returns the appropriate results adapter for each assessment type
 */

// Import adapters - add new adapters here as more assessment types are added
import AgencyVulnerabilityAdapter from '../../assessments/agency-vulnerability/ResultsAdapter';
import InhouseMarketingAdapter from '../../assessments/inhouse-marketing/ResultsAdapter';

class ResultsAdapterFactory {
  /**
   * Get the appropriate adapter instance for the assessment type
   * @param {string} assessmentType - The type of assessment (e.g., 'agency-vulnerability')
   * @returns {Object} - An instance of the appropriate adapter or null if not found
   */
  static getAdapter(assessmentType) {
    console.log(`ResultsAdapterFactory: Getting adapter for ${assessmentType}`);
    
    switch (assessmentType) {
      case 'agency-vulnerability':
        return new AgencyVulnerabilityAdapter();
      case 'inhouse-marketing':
        return new InhouseMarketingAdapter();
      default:
        console.warn(`ResultsAdapterFactory: No adapter found for ${assessmentType}`);
        return null;
    }
  }
  
  /**
   * Adapt results using the appropriate adapter for the assessment type
   * @param {string} assessmentType - The type of assessment
   * @param {Object} rawResults - Raw results from the scoring engine
   * @param {Function} getResponse - Function to retrieve saved responses
   * @returns {Object} - The adapted results or null if adapter not found
   */
  static adaptResults(assessmentType, rawResults, getResponse) {
    const adapter = this.getAdapter(assessmentType);
    
    if (!adapter) {
      console.error(`ResultsAdapterFactory: Failed to get adapter for ${assessmentType}`);
      return rawResults; // Return raw results as fallback
    }
    
    try {
      console.log(`ResultsAdapterFactory: Adapting results for ${assessmentType}`);
      return adapter.adaptResults(rawResults, getResponse);
    } catch (error) {
      console.error(`ResultsAdapterFactory: Error adapting results for ${assessmentType}:`, error);
      return rawResults; // Return raw results as fallback on error
    }
  }
}

export default ResultsAdapterFactory;
