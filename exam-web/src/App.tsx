import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SearchCard, ScoreTable } from './components/SearchCard';
import { StatChart } from './components/StatChart';
import { TopGroupATable } from './components/TopGroupATable';
import { ToastContainer, type ToastMessage } from './components/Toast';
import { apiService, type ScoreData, type StatisticsData, type TopGroupAData } from './services/api';
import './styles/components.css';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Search state
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Reports state
  const [statsData, setStatsData] = useState<StatisticsData | null>(null);
  const [topGroupAData, setTopGroupAData] = useState<TopGroupAData[] | null>(null);
  const [reportsLoading, setReportsLoading] = useState(false);

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSearchResult = (result: ScoreData | null, error: string | null) => {
    setScoreData(result);
    setSearchError(error);
    if (error && error !== 'No student found with this registration number.') {
      addToast('error', error);
    }
  };

  // Fetch reports data when tab is active
  useEffect(() => {
    if (activeTab === 'reports' && !statsData && !topGroupAData) {
      const fetchReports = async () => {
        setReportsLoading(true);
        try {
          const [stats, topA] = await Promise.all([
            apiService.getStatistics(),
            apiService.getTopGroupA()
          ]);
          setStatsData(stats);
          setTopGroupAData(topA);
        } catch (err) {
          console.error(err);
          addToast('error', 'Failed to load report data. Please check connection to the server.');
        } finally {
          setReportsLoading(false);
        }
      };
      fetchReports();
    }
  }, [activeTab, statsData, topGroupAData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="card animate-fade-in">
            <div className="card-header">
              <h3 className="card-title">Hello!</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              No dashboard specification required.
              Cold starting the web app might take some time &#40;20s - 30s&#41;. Please be patient :&#41;.
            </p>
          </div>
        );
      case 'search':
        return (
          <div className="grid-2-col">
            <div>
              <SearchCard onSearchResult={handleSearchResult} />
            </div>
            <div>
              <ScoreTable scoreData={scoreData} error={searchError} />
            </div>
          </div>
        );
      case 'reports':
        if (reportsLoading) {
          return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading reports data...</p>
            </div>
          );
        }
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <StatChart data={statsData} />
            <TopGroupATable data={topGroupAData} />
          </div>
        );
      case 'settings':
        return (
          <div className="card animate-fade-in">
            <div className="card-header">
              <h3 className="card-title">Settings</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>No setting configuration required. Have a good day ^_^</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
