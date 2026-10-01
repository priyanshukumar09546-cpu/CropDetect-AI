import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DetectPage } from './pages/DetectPage';
import { DatasetPage } from './pages/DatasetPage';
import { ModelPage } from './pages/ModelPage';
import { AboutPage } from './pages/AboutPage';
import { DatasetMetadata, ModelInfo, HealthStatus } from './types';
import { getDatasetInfo, getModelInfo, getHealth } from './services/api';
import { initStreamlitBridge, sendFrameHeight } from './services/streamlitBridge';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [datasetInfo, setDatasetInfo] = useState<DatasetMetadata | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // Sync with browser URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['home', 'detect', 'dataset', 'model', 'about'].includes(hash)) {
        setActiveTab(hash);
        setTimeout(sendFrameHeight, 150);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
    setTimeout(sendFrameHeight, 150);
  };

  // Initialize Streamlit Bridge if running in component iframe
  useEffect(() => {
    initStreamlitBridge(
      (mdl) => setModelInfo(mdl),
      (ds) => setDatasetInfo(ds),
      (hlth) => setHealthStatus(hlth)
    );
  }, []);

  // Fetch real dataset and model info once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadBackendData() {
      setLoadingStats(true);
      try {
        const [ds, mdl, health] = await Promise.all([
          getDatasetInfo(),
          getModelInfo(),
          getHealth(),
        ]);
        if (isMounted) {
          setDatasetInfo(ds);
          setModelInfo(mdl);
          setHealthStatus(health);
        }
      } catch (err) {
        console.warn('Backend metadata load warning:', err);
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    }

    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17201A]">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            datasetInfo={datasetInfo}
            modelInfo={modelInfo}
            loadingStats={loadingStats}
            onNavigate={handleTabChange}
          />
        )}

        {activeTab === 'detect' && <DetectPage />}

        {activeTab === 'dataset' && (
          <DatasetPage datasetInfo={datasetInfo} loading={loadingStats} />
        )}

        {activeTab === 'model' && (
          <ModelPage modelInfo={modelInfo} loading={loadingStats} />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />
    </div>
  );
};

export default App;
