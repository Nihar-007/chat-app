class PeerService {
    constructor() {
        this.createPeer(); // Initialize on first load
    }

    createPeer() {
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:global.stun.twilio.com:3478'
                    ]
                },
            ]
        });

        // (Re)Attach listeners
        this.peer.addEventListener('track', (event) => {
            console.log("Track event received on peer:", event);
            if (this.onTrackCallback) {
                this.onTrackCallback(event);
            }
        });

        // You can add other listeners as needed
    }

    createNewPeerConnection() {
        if (this.peer) {
            this.peer.close();
        }
        this.createPeer();
    }

    setOnTrack(callback) {
        this.onTrackCallback = callback;
    }

    async getOffer() {
        if (!this.peer || this.peer.signalingState === 'closed') {
            throw new Error("Cannot create offer on closed peer");
        }

        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }

    async getAnswer(offer) {
        if (!this.peer || this.peer.signalingState === 'closed') {
            throw new Error("Cannot answer on closed peer");
        }

        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(answer));
        return answer;
    }

    async setLocalDescription(answer) {
        if (!this.peer || this.peer.signalingState === 'closed') {
            throw new Error("Cannot set local description on closed peer");
        }

        await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
}

export default new PeerService();
