// Variáveis globais
let currentStep = 1;
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupAudioRecording();
    setupGeolocation();
});

function initializeEventListeners() {
    // Slider de gravidade
    const gravidadeSlider = document.getElementById('gravidade');
    const gravidadeValue = document.getElementById('gravidadeValue');
    
    gravidadeSlider.addEventListener('input', function() {
        gravidadeValue.textContent = this.value;
    });

    // Mostrar/ocultar campos condicionais
    document.querySelectorAll('input[name="tentativasAnteriores"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const descricaoDiv = document.getElementById('descricaoTentativas');
            descricaoDiv.style.display = this.value === 'sim' ? 'block' : 'none';
        });
    });

    document.querySelectorAll('input[name="solucoesSemelhantes"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const ondeDiv = document.getElementById('ondeSolucoes');
            ondeDiv.style.display = this.value === 'sim' ? 'block' : 'none';
        });
    });
}

function setupGeolocation() {
    const localizacaoInput = document.getElementById('localizacao');
    
    // Adicionar botão para detectar localização automaticamente
    const detectLocationBtn = document.createElement('button');
    detectLocationBtn.type = 'button';
    detectLocationBtn.className = 'btn btn-outline-info btn-sm mt-1';
    detectLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Detectar Localização';
    detectLocationBtn.onclick = detectUserLocation;
    
    localizacaoInput.parentNode.appendChild(detectLocationBtn);
}

function detectUserLocation() {
    if (!navigator.geolocation) {
        alert('Geolocalização não é suportada por este navegador.');
        return;
    }

    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detectando...';
    button.disabled = true;

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Usar API de geocoding reverso para obter cidade
            reverseGeocode(lat, lon);
            
            button.innerHTML = originalText;
            button.disabled = false;
        },
        function(error) {
            console.error('Erro ao obter localização:', error);
            alert('Não foi possível obter sua localização. Por favor, digite manualmente.');
            button.innerHTML = originalText;
            button.disabled = false;
        }
    );
}

function reverseGeocode(lat, lon) {
    // Usar API gratuita de geocoding reverso
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`)
        .then(response => response.json())
        .then(data => {
            const cidade = data.city || data.locality || 'Cidade não encontrada';
            const estado = data.principalSubdivision || '';
            const localizacao = estado ? `${cidade}, ${estado}` : cidade;
            
            document.getElementById('localizacao').value = localizacao;
        })
        .catch(error => {
            console.error('Erro no geocoding reverso:', error);
            document.getElementById('localizacao').value = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
        });
}

function setupAudioRecording() {
    const recordBtn = document.getElementById('recordBtn');
    const stopBtn = document.getElementById('stopBtn');
    const transcribeBtn = document.getElementById('transcribeBtn');
    const audioPlayback = document.getElementById('audioPlayback');

    recordBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    transcribeBtn.addEventListener('click', transcribeAudio);

    // Verificar suporte do navegador para gravação
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        recordBtn.disabled = true;
        recordBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Não Suportado';
        return;
    }

    // Verificar suporte para Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        transcribeBtn.disabled = true;
        transcribeBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Transcrição não suportada';
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioPlayback = document.getElementById('audioPlayback');
            
            audioPlayback.src = audioUrl;
            audioPlayback.style.display = 'block';
            
            // Habilitar transcrição se suportada
            if (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window)) {
                document.getElementById('transcribeBtn').disabled = false;
            }
        };

        mediaRecorder.start();
        isRecording = true;

        document.getElementById('recordBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('recordBtn').innerHTML = '<i class="fas fa-circle text-danger"></i> Gravando...';

    } catch (error) {
        console.error('Erro ao acessar microfone:', error);
        alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;

        document.getElementById('recordBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('recordBtn').innerHTML = '<i class="fas fa-microphone"></i> Gravar Áudio';
    }
}

function transcribeAudio() {
    // Usar Web Speech API para transcrição em tempo real
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        // Fallback para simulação se não suportado
        const transcriptionText = "Esta é uma simulação de transcrição de áudio. Em um ambiente real, o áudio seria processado pela Web Speech API ou enviado para uma API de transcrição como Whisper.";
        appendTranscription(transcriptionText);
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    const transcribeBtn = document.getElementById('transcribeBtn');
    const originalText = transcribeBtn.innerHTML;
    transcribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transcrevendo...';
    transcribeBtn.disabled = true;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        appendTranscription(transcript);
        
        transcribeBtn.innerHTML = '<i class="fas fa-check"></i> Transcrito!';
        transcribeBtn.classList.remove('btn-outline-success');
        transcribeBtn.classList.add('btn-success');

        setTimeout(() => {
            transcribeBtn.innerHTML = originalText;
            transcribeBtn.classList.remove('btn-success');
            transcribeBtn.classList.add('btn-outline-success');
            transcribeBtn.disabled = false;
        }, 2000);
    };

    recognition.onerror = function(event) {
        console.error('Erro na transcrição:', event.error);
        // Usar simulação como fallback
        const transcriptionText = "Erro na transcrição automática. Texto simulado: Esta é uma descrição de problema transcrita automaticamente.";
        appendTranscription(transcriptionText);
        
        transcribeBtn.innerHTML = originalText;
        transcribeBtn.disabled = false;
    };

    recognition.start();
}

function appendTranscription(text) {
    const descricaoTextarea = document.getElementById('descricao');
    if (descricaoTextarea.value.trim() === '') {
        descricaoTextarea.value = text;
    } else {
        descricaoTextarea.value += '\n\n' + text;
    }
}

function nextStep(step) {
    if (validateCurrentStep()) {
        // Ocultar etapa atual
        document.querySelector('.form-step.active').classList.remove('active');
        document.querySelector('.step.active').classList.remove('active');
        document.querySelector('.step.active').classList.add('completed');

        // Mostrar próxima etapa
        document.getElementById(`etapa${step}`).classList.add('active');
        document.getElementById(`step${step}`).classList.add('active');

        currentStep = step;

        // Executar análise de IA na etapa 2
        if (step === 2) {
            runAIAnalysis();
        }
    }
}

function previousStep(step) {
    // Ocultar etapa atual
    document.querySelector('.form-step.active').classList.remove('active');
    document.querySelector('.step.active').classList.remove('active');

    // Mostrar etapa anterior
    document.getElementById(`etapa${step}`).classList.add('active');
    document.getElementById(`step${step}`).classList.add('active');
    document.getElementById(`step${step}`).classList.remove('completed');

    currentStep = step;
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const titulo = document.getElementById('titulo').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        if (!titulo || !descricao) {
            alert('Por favor, preencha os campos obrigatórios (Título e Descrição).');
            return false;
        }
    } else if (currentStep === 3) {
        const porqueAgora = document.getElementById('porqueAgora').value.trim();
        
        if (!porqueAgora) {
            alert('Por favor, explique por que o problema deve ser resolvido agora.');
            return false;
        }
    }

    return true;
}

function runAIAnalysis() {
    const progressBar = document.getElementById('aiProgress');
    const aiAnalysis = document.getElementById('aiAnalysis');
    const nextBtn = document.getElementById('nextToStep3');

    // Simular progresso da análise
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showAIResults();
                aiAnalysis.style.display = 'block';
                nextBtn.disabled = false;
            }, 1000);
        }
    }, 300);
}

function showAIResults() {
    // Simular resultados da análise de IA baseada na metodologia TDY
    const formData = getFormData();
    
    // Calcular score TDY-DOR (Triagem-Diagnóstico-Yes/Why - Dor-Oportunidade-Relevância)
    const pessoasAfetadas = parseInt(formData.pessoasAfetadas) || 100;
    const gravidade = parseInt(formData.gravidade) || 5;
    const custoImpacto = formData.custoNaoResolver ? formData.custoNaoResolver.length * 10 : 20;
    
    // Algoritmo TDY-DOR
    const scorePessoas = Math.min(pessoasAfetadas / 1000 * 40, 40);
    const scoreImpacto = gravidade * 4;
    const scoreCusto = Math.min(custoImpacto, 20);
    const scoreTotal = Math.round(scorePessoas + scoreImpacto + scoreCusto);

    document.getElementById('scoreTotal').textContent = scoreTotal;
    document.getElementById('scorePessoas').textContent = Math.round(scorePessoas);
    document.getElementById('scoreImpacto').textContent = Math.round(scoreImpacto);

    // Sugestões de validação baseadas na metodologia TDY
    const suggestions = [
        "Realizar 5-7 entrevistas curtas (Lean Problem Interview) para validar a dor real",
        "Coletar dados quantitativos sobre frequência e intensidade do problema",
        "Pesquisar soluções existentes em outras regiões ou contextos similares",
        "Validar urgência com stakeholders locais e potenciais beneficiários",
        "Mapear recursos disponíveis e parcerias potenciais para implementação",
        "Calcular custo de inação vs. custo de implementação de solução"
    ];

    const suggestionsList = document.getElementById('validationSuggestions');
    suggestionsList.innerHTML = '';
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });

    // Classificação automática baseada em palavras-chave
    const titulo = formData.titulo.toLowerCase();
    const descricao = formData.descricao.toLowerCase();
    const texto = titulo + ' ' + descricao;
    
    let categoria = 'Social';
    let ods = 'ODS 1 - Erradicação da Pobreza';
    
    if (texto.includes('internet') || texto.includes('digital') || texto.includes('tecnologia')) {
        categoria = 'Tecnológico';
        ods = 'ODS 9 - Indústria, Inovação e Infraestrutura';
    } else if (texto.includes('educação') || texto.includes('ensino') || texto.includes('escola')) {
        categoria = 'Educacional';
        ods = 'ODS 4 - Educação de Qualidade';
    } else if (texto.includes('saúde') || texto.includes('médico') || texto.includes('hospital')) {
        categoria = 'Saúde';
        ods = 'ODS 3 - Saúde e Bem-Estar';
    } else if (texto.includes('meio ambiente') || texto.includes('poluição') || texto.includes('sustentável')) {
        categoria = 'Ambiental';
        ods = 'ODS 13 - Ação contra a Mudança Global do Clima';
    }
    
    document.getElementById('categoria').textContent = categoria;
    document.getElementById('ods').textContent = ods;
}

function getFormData() {
    return {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        publico: Array.from(document.getElementById('publico').selectedOptions).map(option => option.value),
        localizacao: document.getElementById('localizacao').value,
        tempoExistencia: document.getElementById('tempoExistencia').value,
        pessoasAfetadas: document.getElementById('pessoasAfetadas').value,
        tentativasAnteriores: document.querySelector('input[name="tentativasAnteriores"]:checked')?.value,
        gravidade: document.getElementById('gravidade').value,
        custoNaoResolver: Array.from(document.getElementById('custoNaoResolver').selectedOptions).map(option => option.value),
        solucoesSemelhantes: document.querySelector('input[name="solucoesSemelhantes"]:checked')?.value,
        porqueAgora: document.getElementById('porqueAgora').value,
        recursosAndamento: document.querySelector('input[name="recursosAndamento"]:checked')?.value,
        engajamento: document.querySelector('input[name="engajamento"]:checked')?.value
    };
}

function submitForm() {
    if (validateCurrentStep()) {
        const formData = getFormData();
        
        // Calcular score final baseado na metodologia TDY
        const scoreTotal = parseInt(document.getElementById('scoreTotal').textContent) || 0;
        let scoreFinal = scoreTotal;
        
        // Ajustar score baseado na etapa 3 (Yes/Why?)
        if (formData.porqueAgora && formData.porqueAgora.length > 50) {
            scoreFinal += 5; // Justificativa bem elaborada
        }
        if (formData.recursosAndamento === 'sim') {
            scoreFinal += 5; // Recursos disponíveis
        }
        if (formData.engajamento === 'sim') {
            scoreFinal += 10; // Engajamento do proponente
        }

        scoreFinal = Math.min(scoreFinal, 100);

        // Determinar status baseado na metodologia TDY
        let status, statusClass;
        if (scoreFinal >= 60) {
            status = 'Aprovado para Challenge';
            statusClass = 'bg-success';
        } else if (scoreFinal >= 40) {
            status = 'Necessita Mais Dados';
            statusClass = 'bg-warning';
        } else {
            status = 'Retornar ao Backlog';
            statusClass = 'bg-danger';
        }

        // Mostrar resultado final
        document.getElementById('scoreFinal').textContent = scoreFinal;
        document.getElementById('statusFinal').textContent = status;
        document.getElementById('statusFinal').className = `badge ${statusClass}`;
        document.getElementById('finalValidation').style.display = 'block';

        // Simular salvamento no backend
        console.log('Dados do formulário (metodologia TDY):', formData);
        console.log('Score TDY-DOR final:', scoreFinal);
        
        // Em um ambiente real, aqui seria feita a requisição para o backend
        setTimeout(() => {
            alert('Problema validado com sucesso usando a metodologia TDY! Redirecionando para o dashboard...');
            // window.location.href = 'dashboard.html';
        }, 2000);
    }
}

