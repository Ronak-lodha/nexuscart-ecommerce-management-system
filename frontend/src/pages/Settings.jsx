import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="flex-center fade-in" style={{ height: '70vh', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-morphism" style={{ padding: '60px', textAlign: 'center' }}>
                <SettingsIcon size={64} color="var(--primary)" className="animate-spin" style={{ animationDuration: '3s', marginBottom: '20px' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Settings</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Feature is Coming Soon!</p>
                <div style={{ marginTop: '30px', height: '4px', width: '100px', background: 'var(--primary)', margin: '30px auto', borderRadius: '2px' }}></div>
            </div>
        </div>
    );
};

export default Settings;
