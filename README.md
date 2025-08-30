# AidPoint – Local Emergency Resource Finder

**AidPoint** is a Progressive Web App (PWA) that provides immediate access to critical emergency resources during times of crisis. Built with React and modern web technologies, AidPoint helps users quickly locate nearby hospitals, police stations, shelters, food banks, legal aid centers, and transportation hubs while maintaining full functionality even when internet connectivity is compromised.

The application addresses a fundamental challenge in emergency preparedness: the need for reliable, accessible information when traditional communication channels may be disrupted. Whether facing a natural disaster, personal emergency, or community crisis, AidPoint ensures users can find help through an intuitive, mobile-first interface that prioritizes speed and reliability.

🎥 **Video Demo**: [AidPoint Demo on YouTube](https://youtu.be/Xt07w23A_9g)

## Core Features and Functionality

**🗺️ Interactive Resource Mapping**: The application integrates Google Maps API to provide real-time location data for emergency services. Users can search for specific resources or browse by category, with results displayed on an interactive map complete with detailed information windows showing addresses, phone numbers, and contact details.

**📞 One-Touch Emergency Communications**: AidPoint provides immediate calling functionality through tel: links that work across all mobile devices. The app includes national emergency hotlines (911, 988 Suicide Crisis Lifeline, National Domestic Violence Hotline) and allows users to maintain their personal emergency contact list with add/edit capabilities.

**⚡ Robust Offline Capabilities**: Understanding that emergencies often coincide with network disruptions, AidPoint implements an offline-first architecture. The app caches essential UI components, maintains a database of critical emergency resources, and gracefully degrades functionality when online services are unavailable.

**📱 Cross-Platform PWA Installation**: Built as a Progressive Web App, AidPoint can be installed directly from the browser onto iOS, Android, and desktop devices, providing native app-like performance without app store downloads.

## Technical Architecture and Design Decisions

**React Component Architecture**: The application follows a component-based architecture with clear separation of concerns. Major screens (Home, Map, Contacts) are implemented as memoized components to prevent unnecessary re-renders, while smaller UI elements like headers, navigation, and loading screens are extracted into reusable components.

**State Management Strategy**: Rather than introducing external state management libraries, the application leverages React's built-in hooks system with strategic use of useCallback and useMemo for performance optimization. A custom useLocalStorage hook encapsulates all persistent storage logic, providing clean APIs while handling storage failures gracefully.

**Location Services Integration**: The geolocation implementation includes comprehensive error handling for various failure modes (permission denied, unavailable, timeout) while maintaining a fallback to a default location to ensure the app remains functional regardless of location access permissions.

**Google Maps Integration**: The Maps integration uses the @react-google-maps/api library with careful configuration to minimize bundle size. The implementation includes custom marker icons, info windows with formatted contact information, and seamless switching between online and offline data sources.

## File Structure and Component Breakdown

**App.js** serves as the main application orchestrator, managing global state, navigation between screens, and coordination between different feature modules. It implements core business logic for location services, online/offline detection, and emergency contact management.

**Component Definitions**: Each major screen component handles specific user interface and interaction patterns:

- **HomeScreen**: Presents the main resource category grid with visual cards for each emergency service type. Clicking any category automatically navigates to the map view with appropriate search filters applied.

- **MapScreen**: Manages complex interaction between search functionality, map rendering, and data source switching. When online, it performs live Google Places searches within a configurable radius. When offline, it filters through cached resource data to provide relevant results.

- **ContactsScreen**: Implements a multi-view interface for managing both emergency hotlines and personal emergency contacts, complete with add/edit functionality and persistent storage.

**Utility Functions and Custom Hooks**: The codebase includes several utility functions that enhance functionality while maintaining clean separation:

- **useDebounced**: Prevents excessive API calls during search by debouncing user input with a 400ms delay
- **useLocalStorage**: Provides reliable persistent storage with automatic error handling and state synchronization
- **formatPhoneDigits**: Ensures telephone numbers are properly formatted for tel: links across different input formats

## Design Philosophy and User Experience

The interface design prioritizes accessibility and usability under stress conditions. The dark theme reduces eye strain and conserves battery life on mobile devices, while high-contrast accent colors (emerald green) ensure critical action buttons remain visible. Typography choices favor readability with clear, modern aesthetics.

Navigation follows familiar mobile app patterns with a bottom tab bar for primary functions and consistent back navigation for secondary screens. Loading states and error messages provide clear feedback to users, particularly important when dealing with network connectivity issues or location permission problems.

Emergency calling functions are prominently displayed and require minimal user input to activate, reflecting the critical nature of the application's purpose. The application implements progressive disclosure, showing essential information first while providing access to detailed data through interaction.

## Offline Strategy and Performance Optimization

AidPoint's offline capabilities represent a core differentiating feature. The application maintains a curated database of essential emergency resources that remain accessible even without internet connectivity. This offline database includes police stations, hospitals, and shelters with basic contact information and addresses.

The React component structure emphasizes performance through strategic memoization. React.memo wraps components that receive frequent prop updates, while useCallback ensures event handlers maintain stable references across renders. The Google Maps integration loads efficiently through selective library imports and careful API usage patterns.

## Technical Implementation Highlights

The application demonstrates several sophisticated technical implementations. The custom useLocalStorage hook abstracts localStorage complexity while providing graceful degradation when storage is unavailable. The debounced search functionality prevents API rate limiting while maintaining responsive user interaction.

Location services integrate multiple fallback strategies: GPS location with permission handling, stored last-known location, and default coordinates ensuring the app always has a functional center point for map operations. The Google Places integration switches seamlessly between live API data and cached offline resources based on connectivity status.

Component architecture follows React best practices with memo-wrapped components, stable callback references, and efficient re-render patterns. The PWA implementation provides native app-like installation and performance while maintaining web accessibility and cross-platform compatibility.

This emergency resource finder demonstrates practical application of modern web technologies to address real-world crisis management needs, providing a reliable, accessible tool that could prove invaluable during emergency situations.
