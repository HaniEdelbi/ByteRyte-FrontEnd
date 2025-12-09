import { useDevices, useRevokeDevice } from '../hooks/useSession';

export default function SessionsTest() {
  const { data: devices, isLoading, error } = useDevices();
  const revokeDevice = useRevokeDevice();

  console.log('=== SESSIONS TEST ===');
  console.log('Loading:', isLoading);
  console.log('Error:', error);
  console.log('Devices:', devices);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-4">Sessions Test Page</h1>
      
      <div className="mb-4 p-4 bg-muted rounded">
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Error: {error ? error.message : 'None'}</p>
        <p>Devices Count: {devices ? devices.length : 'undefined'}</p>
      </div>

      {isLoading && <p>Loading devices...</p>}
      
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {devices && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Devices ({devices.length}):</h2>
          <pre className="bg-muted p-4 rounded overflow-auto">
            {JSON.stringify(devices, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
