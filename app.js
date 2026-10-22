(function () {
  'use strict';

  const DEFAULT_GUESTS = [
    { id: '1', code: '001', name: 'Nguyễn Văn A', phone: '0901234567', won: false, wonAt: null },
    { id: '2', code: '002', name: 'Nguyễn Văn B', phone: '0901234568', won: false, wonAt: null },
    { id: '3', code: '003', name: 'Nguyễn Văn C', phone: '0901234569', won: false, wonAt: null },
    { id: '4', code: '004', name: 'Nguyễn Văn D', phone: '0901234570', won: false, wonAt: null },
    { id: '5', code: '005', name: 'Nguyễn Văn E', phone: '0901234571', won: false, wonAt: null },
    { id: '6', code: '006', name: 'Nguyễn Văn F', phone: '0901234572', won: false, wonAt: null },
    { id: '7', code: '007', name: 'Nguyễn Văn G', phone: '0901234573', won: false, wonAt: null },
    { id: '8', code: '008', name: 'Nguyễn Văn H', phone: '0901234574', won: false, wonAt: null },
    { id: '9', code: '009', name: 'Nguyễn Văn K', phone: '0901234575', won: false, wonAt: null },
    { id: '10', code: '010', name: 'Nguyễn Văn J', phone: '0901234576', won: false, wonAt: null },
    { id: '11', code: '011', name: 'Trần Thị Mai', phone: '0912345678', won: false, wonAt: null },
    { id: '12', code: '012', name: 'Lê Hoàng Nam', phone: '0923456789', won: false, wonAt: null },
    { id: '13', code: '013', name: 'Phạm Quỳnh Anh', phone: '0934567890', won: false, wonAt: null },
    { id: '14', code: '014', name: 'Đỗ Minh Tuấn', phone: '0945678901', won: false, wonAt: null },
    { id: '15', code: '015', name: 'Vũ Bích Ngọc', phone: '0956789012', won: false, wonAt: null }
  ];

  const STATE = {
    guests: [],
    winners: [],
    isSpinning: false,
    currentCandidate: null,
    settings: {
      coupleNames: 'Đức & Quyên',
      tagline: 'Hôn Lễ Trăm Năm Hạnh Phúc',
      spinDuration: 4,
      soundFx: true,
      confetti: true,
      fallingPetals: true,
      excludeWinners: true
    },
    mascotMode: 'chibi',
    musicPlaying: false
  };

  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTickSound(pitch = 1.0) {
    if (!STATE.settings.soundFx || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500 * pitch, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180 * pitch, audioCtx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) { }
  }

  function playReelLockSound() {
    if (!STATE.settings.soundFx || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.11);
    } catch (e) { }
  }

  function playFanfareSound() {
    if (!STATE.settings.soundFx || !audioCtx) return;
    try {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + idx * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.09 + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.09);
        osc.stop(audioCtx.currentTime + idx * 0.09 + 0.85);
      });
    } catch (e) { }
  }

  function playCameraClick() {
    if (!STATE.settings.soundFx || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) { }
  }

  function playCheerChime() {
    if (!STATE.settings.soundFx || !audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.05);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.05);
        osc.stop(audioCtx.currentTime + idx * 0.05 + 0.4);
      });
    } catch (e) { }
  }

  function getBgMusic() {
    let bgMusic = document.getElementById('weddingBgm');
    if (!bgMusic) {
      bgMusic = new Audio('assets/audio/nhac.mp4');
      bgMusic.id = 'weddingBgm';
      bgMusic.loop = true;
      document.body.appendChild(bgMusic);
    }
    bgMusic.volume = 0.55;
    return bgMusic;
  }

  function toggleBackgroundMusic() {
    initAudio();
    const bgMusic = getBgMusic();
    const soundWave = document.getElementById('soundWave');

    if (bgMusic.paused) {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          STATE.musicPlaying = true;
          if (soundWave) soundWave.classList.add('playing');
          showToast('Đang phát nhạc cưới 🎵');
        }).catch(err => {
          console.warn('Lỗi phát nhạc:', err);
          showToast('Vui lòng bấm lại một lần nữa để phát nhạc');
        });
      }
    } else {
      bgMusic.pause();
      STATE.musicPlaying = false;
      if (soundWave) soundWave.classList.remove('playing');
      showToast('Đã tắt nhạc cưới');
    }
  }

  function loadStateFromStorage() {
    try {
      const isEmptyExplicit = localStorage.getItem('wedding_roll_empty_flag') === 'true';

      if (isEmptyExplicit) {
        STATE.guests = [];
      } else {
        const savedGuests = localStorage.getItem('wedding_roll_guests');
        if (savedGuests && savedGuests !== '[]') {
          STATE.guests = JSON.parse(savedGuests);
        } else {
          STATE.guests = JSON.parse(JSON.stringify(DEFAULT_GUESTS));
          saveGuestsToStorage();
        }
      }

      const savedWinners = localStorage.getItem('wedding_roll_winners');
      if (savedWinners) {
        STATE.winners = JSON.parse(savedWinners);
      }

      const savedSettings = localStorage.getItem('wedding_roll_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);

        if (parsed.coupleNames === 'Quang Linh & Mai Anh' || parsed.coupleNames === 'Duc & Quyen') {
          parsed.coupleNames = 'Đức & Quyên';
        }
        STATE.settings = Object.assign(STATE.settings, parsed);
      }
    } catch (e) {
      STATE.guests = JSON.parse(JSON.stringify(DEFAULT_GUESTS));
    }
  }

  function saveGuestsToStorage() {
    try {
      localStorage.setItem('wedding_roll_guests', JSON.stringify(STATE.guests));
      if (STATE.guests.length > 0) {
        localStorage.removeItem('wedding_roll_empty_flag');
      }
    } catch (e) { }
  }

  function saveWinnersToStorage() {
    try {
      localStorage.setItem('wedding_roll_winners', JSON.stringify(STATE.winners));
    } catch (e) { }
  }

  function saveSettingsToStorage() {
    try {
      localStorage.setItem('wedding_roll_settings', JSON.stringify(STATE.settings));
    } catch (e) { }
  }

  function clearAllDataClean() {
    STATE.guests = [];
    STATE.winners = [];
    STATE.currentCandidate = null;

    localStorage.removeItem('wedding_roll_guests');
    localStorage.removeItem('wedding_roll_winners');
    localStorage.setItem('wedding_roll_empty_flag', 'true');

    updateCandidatesSummary();
    renderRecentWinnersBar();
    renderGuestsTable();
    renderWinnersTable();

    const statusMsg = document.getElementById('statusMsg');
    if (statusMsg) statusMsg.textContent = 'Đã xóa toàn bộ danh sách. Hãy nạp file Excel của bạn lên!';

    showToast('🗑️ Đã xóa toàn bộ dữ liệu thành công!');
  }

  function loadSampleDataAgain() {
    STATE.guests = JSON.parse(JSON.stringify(DEFAULT_GUESTS));
    STATE.winners = [];
    localStorage.removeItem('wedding_roll_empty_flag');
    saveGuestsToStorage();
    saveWinnersToStorage();
    updateCandidatesSummary();
    renderRecentWinnersBar();
    renderGuestsTable();
    renderWinnersTable();
    showToast('✨ Đã nạp lại 15 khách mời mẫu!');
  }

  const coupleQuotes = [
    'Chúc quý khách may mắn rinh quà nha! 🎉',
    'Trăm năm gắn kết - Vạn sự bình an! 💖',
    'Cảm ơn mọi người đã đến chúc phúc cho Đức & Quyên! 💕',
    'Quay số thôi nào! Hồi hộp quá! 🥁',
    'Bách niên giai lão cùng anh/em nhé! 🥂'
  ];
  let quoteIdx = 0;

  function runMascotWalkSequence() {
    const groomActor = document.getElementById('groomActor');
    const brideActor = document.getElementById('brideActor');
    const couplePose = document.getElementById('coupleChibiPose');
    const groomBubble = document.getElementById('groomBubble');
    const brideBubble = document.getElementById('brideBubble');
    const coupleBubble = document.getElementById('coupleBubble');

    if (!groomActor || !brideActor || !couplePose) return;

    couplePose.style.display = 'none';
    couplePose.style.opacity = '0';
    couplePose.style.transform = 'scale(0.8)';
    if (coupleBubble) coupleBubble.classList.remove('show');

    groomActor.style.display = 'flex';
    brideActor.style.display = 'flex';
    groomActor.style.transition = 'none';
    brideActor.style.transition = 'none';

    groomActor.style.left = '-160px';
    brideActor.style.right = '-160px';
    groomActor.style.animation = 'groomWalkStep 0.4s infinite ease-in-out';
    brideActor.style.animation = 'brideWalkStep 0.4s infinite ease-in-out';

    setTimeout(() => {
      groomActor.style.transition = 'left 2.2s cubic-bezier(0.25, 1, 0.5, 1)';
      brideActor.style.transition = 'right 2.2s cubic-bezier(0.25, 1, 0.5, 1)';

      const isMobile = window.innerWidth <= 680;
      groomActor.style.left = isMobile ? 'calc(50% - 85px)' : 'calc(50% - 130px)';
      brideActor.style.right = isMobile ? 'calc(50% - 80px)' : 'calc(50% - 120px)';

      setTimeout(() => {
        if (groomBubble) groomBubble.classList.add('show');
        if (brideBubble) brideBubble.classList.add('show');
      }, 600);

      let steps = 0;
      const stepTimer = setInterval(() => {
        if (steps++ < 8) playTickSound(1.6);
        else clearInterval(stepTimer);
      }, 250);

      setTimeout(() => {
        groomActor.style.animation = 'none';
        brideActor.style.animation = 'none';

        setTimeout(() => {
          playCameraClick();
          createCameraFlash();

          groomActor.style.display = 'none';
          brideActor.style.display = 'none';
          if (groomBubble) groomBubble.classList.remove('show');
          if (brideBubble) brideBubble.classList.remove('show');

          couplePose.style.display = 'flex';
          setTimeout(() => {
            couplePose.style.opacity = '1';
            couplePose.style.transform = 'scale(1)';
            playCheerChime();

            if (coupleBubble) {
              coupleBubble.querySelector('span').textContent = coupleQuotes[0];
              coupleBubble.classList.add('show');
              setTimeout(() => coupleBubble.classList.remove('show'), 4000);
            }
          }, 40);
        }, 700);
      }, 2200);
    }, 40);
  }

  function createCameraFlash() {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.backgroundColor = '#ffffff';
    flash.style.zIndex = '9999';
    flash.style.opacity = '0.9';
    flash.style.transition = 'opacity 0.35s ease-out';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 350);
    }, 70);
  }

  function handleCoupleChibiClick(e) {
    initAudio();
    playCheerChime();

    e.currentTarget.style.transform = 'scale(1.1) translateY(-8px)';
    setTimeout(() => {
      e.currentTarget.style.transform = 'scale(1)';
    }, 260);

    const coupleBubble = document.getElementById('coupleBubble');
    if (coupleBubble) {
      quoteIdx = (quoteIdx + 1) % coupleQuotes.length;
      coupleBubble.querySelector('span').textContent = coupleQuotes[quoteIdx];
      coupleBubble.classList.add('show');
      clearTimeout(coupleBubble._timeout);
      coupleBubble._timeout = setTimeout(() => {
        coupleBubble.classList.remove('show');
      }, 3500);
    }
  }

  function setupReelDigits(reelEl, initialDigit = 0) {
    if (!reelEl) return;
    reelEl.innerHTML = '';
    for (let i = 0; i < 30; i++) {
      const div = document.createElement('div');
      div.className = 'digit';
      div.textContent = (i % 10).toString();
      reelEl.appendChild(div);
    }
    setReelPosition(reelEl, initialDigit);
  }

  let lastRolledDigits = [0, 0, 0];

  function setReelPosition(reelEl, digit) {
    const itemHeight = getReelItemHeight();
    reelEl.style.transform = `translateY(${-(digit * itemHeight)}px)`;
  }

  function getReelItemHeight() {
    const box = document.querySelector('.reel-box');
    return box ? box.offsetHeight : 155;
  }

  function updateReelPositions() {
    const r1 = document.getElementById('reelHundreds');
    const r2 = document.getElementById('reelTens');
    const r3 = document.getElementById('reelUnits');
    if (r1) setReelPosition(r1, lastRolledDigits[0]);
    if (r2) setReelPosition(r2, lastRolledDigits[1]);
    if (r3) setReelPosition(r3, lastRolledDigits[2]);
  }

  window.addEventListener('resize', () => {
    if (!STATE.isSpinning) {
      updateReelPositions();
    }
  });

  function startLuckyDraw() {
    if (STATE.isSpinning) return;
    initAudio();

    const eligible = STATE.guests.filter(g => !STATE.settings.excludeWinners || !g.won);
    if (eligible.length === 0) {
      if (STATE.guests.length === 0) {
        showToast('Danh sách khách mời đang trống! Vui lòng nạp file Excel.');
        const modal = document.getElementById('guestsModalOverlay');
        if (modal) modal.style.display = 'flex';
      } else {
        showToast('Tất cả khách mời đã trúng thưởng!');
      }
      return;
    }

    const winner = eligible[Math.floor(Math.random() * eligible.length)];
    STATE.currentCandidate = winner;
    STATE.isSpinning = true;

    const btnSpin = document.getElementById('btnStartRoll');
    const statusMsg = document.getElementById('statusMsg');
    const indicator = document.querySelector('.status-indicator');
    const coupleImg = document.getElementById('coupleChibiImg');

    if (btnSpin) {
      btnSpin.classList.add('is-spinning');
      btnSpin.querySelector('.spin-label').textContent = 'ĐANG QUAY...';
      btnSpin.querySelector('.spin-icon').textContent = '🌀';
    }
    if (statusMsg) statusMsg.textContent = 'Đang quay số may mắn... Đang tìm kiếm người may mắn!';
    if (indicator) indicator.classList.add('spinning');
    if (coupleImg) coupleImg.style.animation = 'mascotCelebrateBounce 0.28s infinite alternate ease-in-out';

    const codeStr = String(winner.code).padStart(3, '0').slice(-3);
    const d1 = parseInt(codeStr[0], 10) || 0;
    const d2 = parseInt(codeStr[1], 10) || 0;
    const d3 = parseInt(codeStr[2], 10) || 0;

    spinReelsPhased(d1, d2, d3, STATE.settings.spinDuration, winner);
  }

  function spinReelsPhased(d1, d2, d3, totalSec, winner) {
    const b1 = document.getElementById('reelBoxHundreds');
    const b2 = document.getElementById('reelBoxTens');
    const b3 = document.getElementById('reelBoxUnits');
    const r1 = document.getElementById('reelHundreds');
    const r2 = document.getElementById('reelTens');
    const r3 = document.getElementById('reelUnits');

    [b1, b2, b3].forEach(b => {
      b.classList.add('spinning');
      b.classList.remove('locked');
    });

    const itemHeight = getReelItemHeight();
    const startTime = performance.now();
    const durationMs = totalSec * 1000;

    const stop1 = durationMs * 0.45;
    const stop2 = durationMs * 0.70;
    const stop3 = durationMs;

    let stopped1 = false, stopped2 = false, stopped3 = false;
    let lastTick = 0;

    function frame(now) {
      const elapsed = now - startTime;

      if (now - lastTick > 60) {
        lastTick = now;
        playTickSound(1.2 + Math.random() * 0.4);
      }

      if (elapsed < stop1) {
        const y = -(now * 2.8) % (10 * itemHeight);
        r1.style.transform = `translateY(${y}px)`;
      } else if (!stopped1) {
        stopped1 = true;
        b1.classList.remove('spinning');
        b1.classList.add('locked');
        setReelPosition(r1, d1);
        playReelLockSound();
      }

      if (elapsed < stop2) {
        const y = -(now * 3.4) % (10 * itemHeight);
        r2.style.transform = `translateY(${y}px)`;
      } else if (!stopped2) {
        stopped2 = true;
        b2.classList.remove('spinning');
        b2.classList.add('locked');
        setReelPosition(r2, d2);
        playReelLockSound();
      }

      if (elapsed < stop3) {
        const y = -(now * 4.0) % (10 * itemHeight);
        r3.style.transform = `translateY(${y}px)`;
      } else if (!stopped3) {
        stopped3 = true;
        b3.classList.remove('spinning');
        b3.classList.add('locked');
        setReelPosition(r3, d3);
        lastRolledDigits = [d1, d2, d3];
        playReelLockSound();

        setTimeout(() => finishSpin(winner), 350);
        return;
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function finishSpin(winner) {
    STATE.isSpinning = false;

    const btnSpin = document.getElementById('btnStartRoll');
    const statusMsg = document.getElementById('statusMsg');
    const indicator = document.querySelector('.status-indicator');
    const coupleImg = document.getElementById('coupleChibiImg');

    if (btnSpin) {
      btnSpin.classList.remove('is-spinning');
      btnSpin.querySelector('.spin-label').textContent = 'QUAY SỐ MAY MẮN';
      btnSpin.querySelector('.spin-icon').textContent = '🎰';
    }
    if (statusMsg) statusMsg.textContent = `🎉 CHÚC MỪNG MÃ SỐ ${winner.code} - ${winner.name}!`;
    if (indicator) indicator.classList.remove('spinning');
    if (coupleImg) coupleImg.style.animation = 'none';

    playFanfareSound();
    triggerWinnerCelebration();
    showWinnerModal(winner);
  }

  function triggerWinnerCelebration() {
    if (!STATE.settings.confetti || typeof confetti !== 'function') return;

    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.65 },
      colors: ['#ff6584', '#ffd700', '#ffffff', '#ff8fab']
    });

    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.65 },
      colors: ['#ff6584', '#ffd700', '#ffffff', '#ff8fab']
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#ffd700', '#ff6584', '#00e5ff', '#ffffff']
      });
    }, 350);
  }

  function showWinnerModal(winner) {
    const modal = document.getElementById('winnerModalOverlay');
    const luckyCode = document.getElementById('winnerLuckyCode');
    const winnerName = document.getElementById('winnerName');

    if (luckyCode) luckyCode.textContent = winner.code;
    if (winnerName) winnerName.textContent = winner.name;

    if (modal) modal.style.display = 'flex';
  }

  function closeWinnerModal() {
    const modal = document.getElementById('winnerModalOverlay');
    if (modal) modal.style.display = 'none';
  }

  function confirmWinner() {
    if (!STATE.currentCandidate) {
      closeWinnerModal();
      return;
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate()}/${now.getMonth() + 1}`;

    const guest = STATE.guests.find(g => g.id === STATE.currentCandidate.id);
    if (guest) {
      guest.won = true;
      guest.wonAt = timeStr;
    }

    STATE.winners.unshift({
      id: Date.now().toString(),
      code: STATE.currentCandidate.code,
      name: STATE.currentCandidate.name,
      phone: STATE.currentCandidate.phone,
      time: timeStr
    });

    saveGuestsToStorage();
    saveWinnersToStorage();
    updateCandidatesSummary();
    renderRecentWinnersBar();
    renderGuestsTable();
    renderWinnersTable();

    closeWinnerModal();
    playCheerChime();
    showToast(`🏆 Đã trao giải cho: ${STATE.currentCandidate.name}!`);
  }

  function handleExcelFile(file) {
    if (!file) return;
    if (typeof XLSX === 'undefined') {
      showToast('Thư viện Excel đang tải, vui lòng thử lại sau giây lát!');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (jsonData.length <= 1) {
          showToast('File Excel không có dữ liệu khách mời!');
          return;
        }

        parseExcelRows(jsonData);
      } catch (err) {
        showToast('Lỗi đọc file Excel. Vui lòng kiểm tra lại định dạng file!');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function parseExcelRows(rows) {
    const headerRow = rows[0].map(h => (h || '').toString().toLowerCase().trim());
    const norm = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    let colName = -1, colCode = -1, colPhone = -1;

    headerRow.forEach((col, idx) => {
      const n = norm(col);
      if (colName === -1 && (n.includes('ho va ten') || n.includes('ho ten') || n.includes('ten') || n.includes('name'))) {
        colName = idx;
      }
      if (colCode === -1 && (n.includes('ma so') || n.includes('so may man') || n.includes('ma') || n.includes('code') || n.includes('number'))) {
        colCode = idx;
      }
      if (colPhone === -1 && (n.includes('so dien thoai') || n.includes('dien thoai') || n.includes('sdt') || n.includes('phone'))) {
        colPhone = idx;
      }
    });

    if (colName === -1 && rows[0].length >= 2) colName = 1;
    if (colCode === -1 && rows[0].length >= 5) colCode = 4;
    else if (colCode === -1 && rows[0].length >= 1) colCode = rows[0].length - 1;

    const newGuests = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.every(cell => !cell)) continue;

      let name = (colName !== -1 && row[colName]) ? row[colName].toString().trim() : '';
      let code = (colCode !== -1 && row[colCode]) ? row[colCode].toString().trim() : '';
      let phone = (colPhone !== -1 && row[colPhone]) ? row[colPhone].toString().trim() : '';

      if (!name && !code) continue;

      if (code && !isNaN(code)) {
        code = code.padStart(3, '0');
      } else if (!code) {
        code = (newGuests.length + 1).toString().padStart(3, '0');
      }

      newGuests.push({
        id: (Date.now() + r).toString(),
        code: code,
        name: name || `Khách ${code}`,
        phone: phone,
        won: false,
        wonAt: null
      });
    }

    if (newGuests.length === 0) {
      showToast('Không tìm thấy danh sách khách mời hợp lệ!');
      return;
    }

    STATE.guests = newGuests;
    localStorage.removeItem('wedding_roll_empty_flag');
    saveGuestsToStorage();
    updateCandidatesSummary();
    renderGuestsTable();

    showToast(`🎉 Đã nhập thành công ${newGuests.length} khách mời!`);
  }

  function downloadSampleExcelFile() {
    if (typeof XLSX === 'undefined') {
      window.location.href = 'assets/sample_guests.xlsx';
      return;
    }

    const data = [
      ['Dấu thời gian', 'Họ và tên', 'Số điện thoại', 'Lời chúc phúc dành cho cô dâu chú rể', 'Mã số may mắn'],
      ['19/10/2026 08:15:20', 'Nguyễn Văn A', '0901234567', 'Trăm năm hạnh phúc, vạn sự như ý!', '001'],
      ['19/10/2026 08:16:05', 'Nguyễn Văn B', '0901234568', 'Chúc hai bạn sớm có thiên thần nhỏ!', '002'],
      ['19/10/2026 08:18:42', 'Nguyễn Văn C', '0901234569', 'Cung hỷ cung hỷ!', '003']
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh Sách');
    XLSX.writeFile(wb, 'Mau_Danh_Sach_Boc_Tham.xlsx');
  }

  function exportWinnersToExcel() {
    if (STATE.winners.length === 0) {
      showToast('Chưa có khách mời nào trúng thưởng!');
      return;
    }

    const data = [
      ['STT', 'Mã Số May Mắn', 'Họ và Tên', 'Thời Gian Trúng']
    ];

    STATE.winners.forEach((w, idx) => {
      data.push([idx + 1, w.code, w.name, w.time]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh Sách Trúng');
    XLSX.writeFile(wb, `Danh_Sach_Trung_Thuong_${Date.now()}.xlsx`);
  }

  function updateCandidatesSummary() {
    const total = STATE.guests.length;
    const elTotal = document.getElementById('valTotalGuests');
    const badgeGuest = document.getElementById('guestCountBadge');
    const badgeWinner = document.getElementById('winnerCountBadge');
    const emptyPrompt = document.getElementById('emptyStatePrompt');

    if (elTotal) elTotal.textContent = total;
    if (badgeGuest) badgeGuest.textContent = total;
    if (badgeWinner) badgeWinner.textContent = STATE.winners.length;

    if (emptyPrompt) {
      emptyPrompt.style.display = total === 0 ? 'flex' : 'none';
    }
  }

  function renderRecentWinnersBar() {
    const container = document.getElementById('recentWinnersScroll');
    if (!container) return;

    if (STATE.winners.length === 0) {
      container.innerHTML = '<span class="no-winner-text">Chưa có người trúng thưởng. Nhấn QUAY SỐ để bắt đầu!</span>';
      return;
    }

    container.innerHTML = STATE.winners.map(w => `
      <div class="ticker-chip">
        <span class="code">${w.code}</span>
        <span class="name">${w.name}</span>
      </div>
    `).join('');
  }

  function renderGuestsTable(filterText = '') {
    const tbody = document.getElementById('guestsTableBody');
    const statsEl = document.getElementById('modalGuestStats');
    if (!tbody) return;

    const term = filterText.toLowerCase().trim();
    const filtered = STATE.guests.filter(g => {
      if (!term) return true;
      return (
        g.name.toLowerCase().includes(term) ||
        g.code.toLowerCase().includes(term) ||
        (g.phone && g.phone.toLowerCase().includes(term))
      );
    });

    if (statsEl) {
      statsEl.textContent = `${filtered.length} / ${STATE.guests.length} khách mời`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">Danh sách khách mời đang trống.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((g, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="text-align: center; font-weight: 800; color: var(--pink-dark);">${g.code}</td>
        <td style="font-weight: 600;">${g.name}</td>
        <td style="text-align: center;">${g.phone || '---'}</td>
        <td style="text-align: center;">
          ${g.won ? `<span class="badge-tag won">Đã Trúng</span>` : `<span class="badge-tag ready">Sẵn Sàng</span>`}
        </td>
        <td style="text-align: center;">
          <button class="btn-small-danger btn-delete-guest" data-id="${g.id}" style="padding: 2px 6px; font-size: 0.72rem;">Xóa</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-delete-guest').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        STATE.guests = STATE.guests.filter(g => g.id !== id);
        saveGuestsToStorage();
        updateCandidatesSummary();
        renderGuestsTable();
      });
    });
  }

  function renderWinnersTable() {
    const tbody = document.getElementById('winnersTableBody');
    const totalCount = document.getElementById('totalWinnersCount');
    if (!tbody) return;

    if (totalCount) totalCount.textContent = STATE.winners.length;

    if (STATE.winners.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">Chưa có lượt trúng thưởng nào.</td></tr>`;
      return;
    }

    tbody.innerHTML = STATE.winners.map((w, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="text-align: center; font-weight: 900; color: var(--pink-dark);">${w.code}</td>
        <td style="font-weight: 700;">${w.name}</td>
        <td style="text-align: center; font-size: 0.8rem; color: var(--text-muted);">${w.time}</td>
        <td style="text-align: center;">
          <button class="btn-small-danger btn-delete-winner" data-id="${w.id}" style="padding: 2px 6px; font-size: 0.72rem;">✕</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-delete-winner').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const win = STATE.winners.find(w => w.id === id);
        if (!win) return;
        STATE.winners = STATE.winners.filter(w => w.id !== id);
        const guest = STATE.guests.find(g => g.code === win.code);
        if (guest) {
          guest.won = false;
          guest.wonAt = null;
        }
        saveGuestsToStorage();
        saveWinnersToStorage();
        updateCandidatesSummary();
        renderRecentWinnersBar();
        renderGuestsTable();
        renderWinnersTable();
      });
    });
  }

  function initAmbientCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 7 + 5,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: Math.sin(Math.random() * 2) * 0.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.5 + 0.35
      });
    }

    function render() {
      if (!STATE.settings.fallingPetals) {
        ctx.clearRect(0, 0, w, h);
        requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5;
        p.rotation += p.rotSpeed;

        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size / 2, -p.size, p.size * 1.5, -p.size / 2, 0, p.size * 1.2);
        ctx.bezierCurveTo(-p.size * 1.5, -p.size / 2, -p.size / 2, -p.size, 0, 0);
        ctx.fillStyle = '#ff8fab';
        ctx.fill();

        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  function toggleFullscreen() {
    const doc = document;
    const docEl = doc.documentElement;
    const isFs = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement || doc.body.classList.contains('fullscreen-mode');

    if (!isFs) {
      const requestFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
      if (requestFs) {
        requestFs.call(docEl)
          .then(() => updateFullscreenIcon(true))
          .catch(() => {

            doc.body.classList.add('fullscreen-mode');
            updateFullscreenIcon(true);
            showToast('Đã mở toàn màn hình (chế độ trình chiếu)');
          });
      } else {
        doc.body.classList.add('fullscreen-mode');
        updateFullscreenIcon(true);
        showToast('Đã mở toàn màn hình');
      }
    } else {
      const exitFs = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
      if (exitFs && (doc.fullscreenElement || doc.webkitFullscreenElement)) {
        exitFs.call(doc)
          .then(() => updateFullscreenIcon(false))
          .catch(() => {});
      }
      doc.body.classList.remove('fullscreen-mode');
      updateFullscreenIcon(false);
    }
  }

  function updateFullscreenIcon(isFullscreen) {
    const icon = document.getElementById('fullscreenIcon');
    if (icon) icon.textContent = isFullscreen ? '✕' : '⛶';
  }

  function bindEvents() {

    const btnSpin = document.getElementById('btnStartRoll');
    if (btnSpin) btnSpin.addEventListener('click', startLuckyDraw);

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        startLuckyDraw();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.style.display = 'none');
        document.body.classList.remove('fullscreen-mode');
        updateFullscreenIcon(false);
      }
    });

    const btnReplay = document.getElementById('btnReplayWalk');
    if (btnReplay) btnReplay.addEventListener('click', runMascotWalkSequence);

    const couplePose = document.getElementById('coupleChibiPose');
    if (couplePose) couplePose.addEventListener('click', handleCoupleChibiClick);

    const btnModeChibi = document.getElementById('btnModeChibi');
    const btnModeReal = document.getElementById('btnModeReal');
    const chibiStage = document.getElementById('chibiActorsContainer');
    const realStage = document.getElementById('realPhotoStage');

    if (btnModeChibi && btnModeReal) {
      btnModeChibi.addEventListener('click', () => {
        btnModeChibi.classList.add('active');
        btnModeReal.classList.remove('active');
        chibiStage.style.display = 'flex';
        realStage.style.display = 'none';
        STATE.mascotMode = 'chibi';
      });

      btnModeReal.addEventListener('click', () => {
        btnModeReal.classList.add('active');
        btnModeChibi.classList.remove('active');
        chibiStage.style.display = 'none';
        realStage.style.display = 'flex';
        STATE.mascotMode = 'real';
      });
    }

    const btnDirectClear = document.getElementById('btnDirectClearData');
    if (btnDirectClear) btnDirectClear.addEventListener('click', clearAllDataClean);

    const btnModalClear = document.getElementById('btnModalClearGuests');
    if (btnModalClear) btnModalClear.addEventListener('click', clearAllDataClean);

    const btnPromptLoad = document.getElementById('btnPromptLoadSample');
    if (btnPromptLoad) btnPromptLoad.addEventListener('click', loadSampleDataAgain);

    const btnMusic = document.getElementById('btnToggleMusic');
    if (btnMusic) btnMusic.addEventListener('click', toggleBackgroundMusic);

    const bgmEl = document.getElementById('weddingBgm');
    if (bgmEl) {
      bgmEl.addEventListener('play', () => {
        STATE.musicPlaying = true;
        const soundWave = document.getElementById('soundWave');
        if (soundWave) soundWave.classList.add('playing');
      });
      bgmEl.addEventListener('pause', () => {
        STATE.musicPlaying = false;
        const soundWave = document.getElementById('soundWave');
        if (soundWave) soundWave.classList.remove('playing');
      });
    }

    const btnFullscreen = document.getElementById('btnToggleFullscreen');
    if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);

    const btnOpenExcel = document.getElementById('btnOpenExcelModal');
    const btnCloseGuests = document.getElementById('btnCloseGuestsModal');
    const btnSaveGuests = document.getElementById('btnSaveCloseGuests');
    const guestsModal = document.getElementById('guestsModalOverlay');

    if (btnOpenExcel) btnOpenExcel.addEventListener('click', () => {
      renderGuestsTable();
      if (guestsModal) guestsModal.style.display = 'flex';
    });
    if (btnCloseGuests) btnCloseGuests.addEventListener('click', () => guestsModal.style.display = 'none');
    if (btnSaveGuests) btnSaveGuests.addEventListener('click', () => guestsModal.style.display = 'none');

    const btnPromptUpload = document.getElementById('btnPromptUpload');
    if (btnPromptUpload) {
      btnPromptUpload.addEventListener('click', () => {
        if (guestsModal) guestsModal.style.display = 'flex';
      });
    }

    const btnOpenWinners = document.getElementById('btnOpenWinners');
    const btnCloseWinners = document.getElementById('btnCloseWinnersModal');
    const btnCloseWinnersFoot = document.getElementById('btnCloseWinnersFooter');
    const winnersModal = document.getElementById('winnersModalOverlay');

    if (btnOpenWinners) btnOpenWinners.addEventListener('click', () => {
      renderWinnersTable();
      if (winnersModal) winnersModal.style.display = 'flex';
    });
    if (btnCloseWinners) btnCloseWinners.addEventListener('click', () => winnersModal.style.display = 'none');
    if (btnCloseWinnersFoot) btnCloseWinnersFoot.addEventListener('click', () => winnersModal.style.display = 'none');

    const btnOpenSettings = document.getElementById('btnOpenSettings');
    const btnCloseSettings = document.getElementById('btnCloseSettingsModal');
    const settingsModal = document.getElementById('settingsModalOverlay');
    const coupleNamesDisplay = document.getElementById('coupleNamesDisplay');

    if (btnOpenSettings) btnOpenSettings.addEventListener('click', openSettingsModal);
    if (coupleNamesDisplay) coupleNamesDisplay.addEventListener('click', openSettingsModal);
    if (btnCloseSettings) btnCloseSettings.addEventListener('click', () => settingsModal.style.display = 'none');

    const btnConfirm = document.getElementById('btnConfirmWinner');
    if (btnConfirm) btnConfirm.addEventListener('click', confirmWinner);

    const btnRedraw = document.getElementById('btnRedraw');
    if (btnRedraw) btnRedraw.addEventListener('click', () => {
      closeWinnerModal();
      const statusMsg = document.getElementById('statusMsg');
      if (statusMsg) statusMsg.textContent = 'Đã hủy kết quả. Nhấn QUAY SỐ để quay lại!';
    });

    const dropZone = document.getElementById('excelDropZone');
    const fileInput = document.getElementById('excelFileInput');
    const btnBrowse = document.getElementById('btnTriggerBrowse');
    const btnSample = document.getElementById('btnDownloadSampleExcel');

    if (btnBrowse && fileInput) {
      btnBrowse.addEventListener('click', () => fileInput.click());
    }
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', (e) => {
        if (e.target !== btnBrowse && e.target !== btnSample && !e.target.closest('#btnModalClearGuests')) {
          fileInput.click();
        }
      });

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          handleExcelFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleExcelFile(e.target.files[0]);
        }
      });
    }

    if (btnSample) btnSample.addEventListener('click', downloadSampleExcelFile);

    const guestSearch = document.getElementById('guestSearchInput');
    if (guestSearch) {
      guestSearch.addEventListener('input', (e) => renderGuestsTable(e.target.value));
    }

    const btnAddNew = document.getElementById('btnAddNewGuest');
    const addModal = document.getElementById('addGuestModalOverlay');
    const btnCloseAdd = document.getElementById('btnCloseAddGuest');
    const btnCancelAdd = document.getElementById('btnCancelAddGuest');
    const btnConfirmAdd = document.getElementById('btnConfirmAddGuest');

    if (btnAddNew) {
      btnAddNew.addEventListener('click', () => {
        document.getElementById('newGuestName').value = '';
        document.getElementById('newGuestCode').value = (STATE.guests.length + 1).toString().padStart(3, '0');
        document.getElementById('newGuestPhone').value = '';
        if (addModal) addModal.style.display = 'flex';
      });
    }
    if (btnCloseAdd) btnCloseAdd.addEventListener('click', () => addModal.style.display = 'none');
    if (btnCancelAdd) btnCancelAdd.addEventListener('click', () => addModal.style.display = 'none');
    if (btnConfirmAdd) {
      btnConfirmAdd.addEventListener('click', () => {
        const name = document.getElementById('newGuestName').value.trim();
        const code = document.getElementById('newGuestCode').value.trim();
        const phone = document.getElementById('newGuestPhone').value.trim();

        if (!name || !code) {
          alert('Vui lòng điền Họ tên và Mã số may mắn!');
          return;
        }

        STATE.guests.push({
          id: Date.now().toString(),
          code: code,
          name: name,
          phone: phone,
          won: false,
          wonAt: null
        });

        localStorage.removeItem('wedding_roll_empty_flag');
        saveGuestsToStorage();
        updateCandidatesSummary();
        renderGuestsTable();
        addModal.style.display = 'none';
        showToast(`Đã thêm khách mời: ${name}`);
      });
    }

    const btnExport = document.getElementById('btnExportWinnersExcel');
    if (btnExport) btnExport.addEventListener('click', exportWinnersToExcel);

    const btnClearWinners = document.getElementById('btnClearWinnersHistory');
    if (btnClearWinners) {
      btnClearWinners.addEventListener('click', () => {
        STATE.winners = [];
        STATE.guests.forEach(g => {
          g.won = false;
          g.wonAt = null;
        });
        saveGuestsToStorage();
        saveWinnersToStorage();
        updateCandidatesSummary();
        renderRecentWinnersBar();
        renderWinnersTable();
        renderGuestsTable();
        showToast('Đã xóa sạch lịch sử trúng thưởng!');
      });
    }

    const chkExclude = document.getElementById('chkExcludeWinners');
    if (chkExclude) {
      chkExclude.addEventListener('change', (e) => {
        STATE.settings.excludeWinners = e.target.checked;
        saveSettingsToStorage();
        updateCandidatesSummary();
      });
    }

    const btnSaveSettings = document.getElementById('btnSaveSettings');
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        const names = document.getElementById('settingCoupleNames').value.trim();
        const tagline = document.getElementById('settingTagline').value.trim();
        const dur = parseInt(document.getElementById('settingSpinDuration').value, 10);
        const sfx = document.getElementById('settingSoundFx').checked;
        const conf = document.getElementById('settingConfetti').checked;
        const pet = document.getElementById('settingFallingPetals').checked;

        if (names) STATE.settings.coupleNames = names;
        if (tagline) STATE.settings.tagline = tagline;
        STATE.settings.spinDuration = isNaN(dur) ? 4 : dur;
        STATE.settings.soundFx = sfx;
        STATE.settings.confetti = conf;
        STATE.settings.fallingPetals = pet;

        saveSettingsToStorage();
        applySettingsToUI();
        if (settingsModal) settingsModal.style.display = 'none';
        showToast('Đã lưu cài đặt!');
      });
    }

    const sliderDur = document.getElementById('settingSpinDuration');
    const valDur = document.getElementById('valSpinDuration');
    if (sliderDur && valDur) {
      sliderDur.addEventListener('input', (e) => {
        valDur.textContent = `${e.target.value}s`;
      });
    }
  }

  function openSettingsModal() {
    const settingsModal = document.getElementById('settingsModalOverlay');
    if (!settingsModal) return;

    document.getElementById('settingCoupleNames').value = STATE.settings.coupleNames;
    document.getElementById('settingTagline').value = STATE.settings.tagline;
    document.getElementById('settingSpinDuration').value = STATE.settings.spinDuration;
    document.getElementById('valSpinDuration').textContent = `${STATE.settings.spinDuration}s`;
    document.getElementById('settingSoundFx').checked = STATE.settings.soundFx;
    document.getElementById('settingConfetti').checked = STATE.settings.confetti;
    document.getElementById('settingFallingPetals').checked = STATE.settings.fallingPetals;

    settingsModal.style.display = 'flex';
  }

  function applySettingsToUI() {
    const namesEl = document.getElementById('coupleNamesDisplay');
    const taglineEl = document.getElementById('taglineDisplay');
    const chkExclude = document.getElementById('chkExcludeWinners');

    if (namesEl) namesEl.textContent = STATE.settings.coupleNames;
    if (taglineEl) taglineEl.textContent = STATE.settings.tagline;
    if (chkExclude) chkExclude.checked = STATE.settings.excludeWinners;
  }

  function init() {
    loadStateFromStorage();
    applySettingsToUI();
    updateCandidatesSummary();
    renderRecentWinnersBar();

    const r1 = document.getElementById('reelHundreds');
    const r2 = document.getElementById('reelTens');
    const r3 = document.getElementById('reelUnits');
    setupReelDigits(r1, 0);
    setupReelDigits(r2, 0);
    setupReelDigits(r3, 0);

    initAmbientCanvas();
    bindEvents();

    setTimeout(() => {
      runMascotWalkSequence();
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
