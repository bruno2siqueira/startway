# Guia Técnico - MVP PROBY

## Arquitetura do Sistema

### Estrutura de Pastas
```
mvp-proby/
├── formulario/
│   ├── index.html          # Formulário principal TDY
│   └── script.js           # Lógica JavaScript
├── trilha/
│   └── index.html          # Interface da trilha Lean Startup
├── mentores/
│   └── index.html          # Sistema de mentores
├── assets/
│   └── audio/              # Arquivos de áudio gravados
├── requisitos/
│   ├── documento_de_requisitos.md
│   ├── apis_research.md
│   ├── demonstracao_mvp.md
│   ├── manual_usuario.md
│   └── guia_tecnico.md
└── database/               # Simulação de dados (futuro backend)
```

## Tecnologias Utilizadas

### Frontend
- **HTML5:** Estrutura semântica e acessível
- **CSS3:** Bootstrap 5 para responsividade
- **JavaScript ES6+:** Funcionalidades interativas
- **Font Awesome:** Ícones e elementos visuais

### APIs Integradas
- **Web Speech API:** Transcrição de áudio nativa
- **Geolocation API:** Detecção de localização
- **MediaRecorder API:** Gravação de áudio
- **BigDataCloud API:** Geocoding reverso gratuito

## Implementação da Metodologia TDY

### Algoritmo TDY-DOR

```javascript
function calculateTDYScore(formData) {
    const pessoasAfetadas = parseInt(formData.pessoasAfetadas) || 100;
    const gravidade = parseInt(formData.gravidade) || 5;
    const custoImpacto = formData.custoNaoResolver ? 
        formData.custoNaoResolver.length * 10 : 20;
    
    // Scoring baseado na metodologia TDY-DOR
    const scorePessoas = Math.min(pessoasAfetadas / 1000 * 40, 40);
    const scoreImpacto = gravidade * 4;
    const scoreCusto = Math.min(custoImpacto, 20);
    
    return Math.round(scorePessoas + scoreImpacto + scoreCusto);
}
```

### Classificação Automática

```javascript
function classifyProblem(titulo, descricao) {
    const texto = (titulo + ' ' + descricao).toLowerCase();
    
    const categorias = {
        'tecnológico': ['internet', 'digital', 'tecnologia', 'app'],
        'educacional': ['educação', 'ensino', 'escola', 'professor'],
        'saúde': ['saúde', 'médico', 'hospital', 'doença'],
        'ambiental': ['meio ambiente', 'poluição', 'sustentável'],
        'social': ['comunidade', 'social', 'família', 'pobreza']
    };
    
    for (const [categoria, palavras] of Object.entries(categorias)) {
        if (palavras.some(palavra => texto.includes(palavra))) {
            return categoria;
        }
    }
    
    return 'social'; // default
}
```

## Funcionalidades Implementadas

### 1. Gravação e Transcrição de Áudio

```javascript
// Configuração da gravação
async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Processar áudio...
    };
    
    mediaRecorder.start();
}

// Transcrição com Web Speech API
function transcribeAudio() {
    const recognition = new (window.SpeechRecognition || 
        window.webkitSpeechRecognition)();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        appendTranscription(transcript);
    };
    
    recognition.start();
}
```

### 2. Geolocalização Automática

```javascript
function detectUserLocation() {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            reverseGeocode(lat, lon);
        },
        function(error) {
            console.error('Erro ao obter localização:', error);
        }
    );
}

function reverseGeocode(lat, lon) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const cidade = data.city || data.locality || 'Cidade não encontrada';
            const estado = data.principalSubdivision || '';
            const localizacao = estado ? `${cidade}, ${estado}` : cidade;
            
            document.getElementById('localizacao').value = localizacao;
        })
        .catch(error => {
            console.error('Erro no geocoding reverso:', error);
        });
}
```

### 3. Sistema de Validação

```javascript
function validateCurrentStep() {
    if (currentStep === 1) {
        const titulo = document.getElementById('titulo').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        if (!titulo || !descricao) {
            alert('Por favor, preencha os campos obrigatórios.');
            return false;
        }
    }
    
    return true;
}
```

## Configuração do Ambiente

### Requisitos
- Navegador moderno com suporte a ES6+
- HTTPS para funcionalidades de mídia (em produção)
- Permissões para microfone e localização

### Instalação Local
1. Clone o repositório
2. Abra `formulario/index.html` em um servidor local
3. Configure HTTPS se necessário para APIs de mídia

### Estrutura de Dados

```javascript
// Exemplo de objeto de problema
const problema = {
    id: 'uuid-v4',
    titulo: 'String',
    descricao: 'String',
    publico: ['Array', 'de', 'strings'],
    localizacao: 'String',
    tempoExistencia: 'String',
    pessoasAfetadas: 'Number',
    tentativasAnteriores: 'Boolean',
    gravidade: 'Number (0-10)',
    custoNaoResolver: ['Array', 'de', 'impactos'],
    solucoesSemelhantes: 'Boolean',
    scoreTDY: 'Number (0-100)',
    categoria: 'String',
    ods: 'String',
    status: 'String',
    dataRegistro: 'Date',
    audioUrl: 'String (opcional)',
    validacoesSugeridas: ['Array', 'de', 'strings']
};
```

## Próximas Implementações

### Backend (Recomendado: Flask)
```python
# Estrutura sugerida para API
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/problemas', methods=['POST'])
def criar_problema():
    data = request.json
    # Processar dados TDY
    # Salvar no banco de dados
    return jsonify({'id': problema_id, 'score': score})

@app.route('/api/problemas/<id>', methods=['GET'])
def obter_problema(id):
    # Buscar problema no banco
    return jsonify(problema)
```

### Banco de Dados (Sugerido: PostgreSQL)
```sql
-- Tabela principal de problemas
CREATE TABLE problemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    publico_afetado TEXT[],
    localizacao VARCHAR(255),
    tempo_existencia VARCHAR(50),
    pessoas_afetadas INTEGER,
    tentativas_anteriores BOOLEAN,
    gravidade INTEGER CHECK (gravidade >= 0 AND gravidade <= 10),
    custo_nao_resolver TEXT[],
    solucoes_semelhantes BOOLEAN,
    score_tdy INTEGER,
    categoria VARCHAR(100),
    ods VARCHAR(100),
    status VARCHAR(50),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    audio_url VARCHAR(500),
    validacoes_sugeridas TEXT[]
);
```

## Segurança e Performance

### Considerações de Segurança
- Validação de entrada no frontend e backend
- Sanitização de dados antes de salvar
- Rate limiting para APIs
- HTTPS obrigatório em produção

### Otimizações de Performance
- Lazy loading para módulos
- Compressão de áudio
- Cache de resultados de geocoding
- Minificação de assets

## Testes

### Testes Unitários (Sugerido: Jest)
```javascript
// Exemplo de teste para algoritmo TDY
describe('TDY Algorithm', () => {
    test('should calculate correct score', () => {
        const formData = {
            pessoasAfetadas: 1000,
            gravidade: 8,
            custoNaoResolver: ['social', 'financeiro']
        };
        
        const score = calculateTDYScore(formData);
        expect(score).toBe(72); // 40 + 32 + 20
    });
});
```

### Testes de Integração
- Teste de APIs de terceiros
- Teste de funcionalidades de mídia
- Teste de responsividade

## Monitoramento

### Métricas Recomendadas
- Número de problemas registrados
- Taxa de conclusão do formulário
- Uso de funcionalidades (áudio, geolocalização)
- Scores TDY médios por categoria
- Engajamento na trilha de empreendedorismo

### Logs Importantes
- Erros de API
- Falhas de transcrição
- Problemas de geolocalização
- Performance de carregamento

