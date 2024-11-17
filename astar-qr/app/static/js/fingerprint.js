async function getDeviceFingerprint() {
    // Only collect stable hardware characteristics
    const stableFingerprint = {
        // Screen properties are hardware-specific and rarely change
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            depth: window.screen.colorDepth,
            ratio: window.devicePixelRatio
        },
        // CPU/GPU info is hardware-specific
        hardware: {
            cores: navigator.hardwareConcurrency || 'unknown',
            gpu: await getGPUInfo(),
            platform: navigator.platform
        },
        // Basic device capabilities
        touch: 'ontouchstart' in window,
        mobile: /Mobile|Android|iOS/.test(navigator.userAgent)
    };

    return stableFingerprint;
}

async function getGPUInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return 'unknown';
    
    // GPU renderer info is one of the most reliable hardware identifiers
    return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER)
    };
}

async function submitRegistration() {
    const netID = document.getElementById('netID').value;
    if (!netID) {
        showStatus('Please enter your NetID', false);
        return;
    }

    // Show loading state
    const button = document.querySelector('button');
    button.disabled = true;
    button.textContent = 'Processing...';

    try {
        const fingerprint = await getDeviceFingerprint();
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                netID: netID,
                fingerprint: fingerprint
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            showStatus(`Registration successful! Your assigned group is ${data.group}`, true);
        } else {
            showStatus(data.error || 'Registration failed', false);
        }
    } catch (error) {
        showStatus('An error occurred during registration', false);
        console.error('Error:', error);
    } finally {
        button.disabled = false;
        button.textContent = 'Register Device';
    }
}

function showStatus(message, isSuccess) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    statusDiv.className = isSuccess ? 'success' : 'error';
}