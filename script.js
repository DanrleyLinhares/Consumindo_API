const cep = document.getElementById('cep');
        const logradouro = document.getElementById('logradouro');
        const bairro = document.getElementById('bairro');
        const localidade = document.getElementById('localidade');
        const botaoConsulta = document.getElementById('botaoConsulta');
        const primeiroNome = document.getElementById('primeiroNome');
        const email = document.getElementById('email');
        const latitude = document.getElementById('latitude');
        const longitude = document.getElementById('longitude');
        const temperatureElement = document.getElementById('temperature');
        const nomeError = document.getElementById('nomeError');
        const emailError = document.getElementById('emailError');
        const cepError = document.getElementById('cepError');
        const coordsError = document.getElementById('coordsError');

        function validateInputs() {
            let isValid = true;

            if (!primeiroNome.checkValidity()) {
                nomeError.textContent = 'Por favor, insira seu primeiro nome.';
                isValid = false;
            } else {
                nomeError.textContent = '';
            }

            if (!email.checkValidity()) {
                emailError.textContent = 'Por favor, insira um e-mail válido.';
                isValid = false;
            } else {
                emailError.textContent = '';
            }

            if (!cep.checkValidity()) {
                cepError.textContent = 'Por favor, insira um CEP válido com 8 dígitos.';
                isValid = false;
            } else {
                cepError.textContent = '';
            }

            if (!latitude.checkValidity() || !longitude.checkValidity()) {
                coordsError.textContent = 'Por favor, insira coordenadas válidas (latitude e longitude).';
                isValid = false;
            } else {
                coordsError.textContent = '';
            }

            return isValid;
        }

        botaoConsulta.addEventListener('click', () => {
            if (validateInputs()) {
                let consultCep = cep.value;

                // Busca o endereço pelo CEP
                fetch(`https://viacep.com.br/ws/${consultCep}/json/`)
                    .then(resposta => resposta.json())
                    .then(json => {
                        if (!json.erro) {
                            logradouro.textContent = json.logradouro;
                            bairro.textContent = json.bairro;
                            localidade.textContent = `${json.localidade}/${json.uf}`;
                        } else {
                            logradouro.textContent = 'CEP não encontrado';
                            bairro.textContent = '-';
                            localidade.textContent = '-';
                            alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar o CEP:', error);
                    });

                // Busca a previsão do tempo pela latitude e longitude
                let lat = latitude.value;
                let lon = longitude.value;
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.hourly && data.hourly.temperature_2m && data.hourly.temperature_2m.length > 0) {
                            let currentTemperature = data.hourly.temperature_2m[0]; 
                            temperatureElement.textContent = currentTemperature; 
                        } else {
                            temperatureElement.textContent = 'N/A';
                            alert('Previsão do tempo não encontrada para as coordenadas fornecidas.');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar a previsão do tempo:', error);
                    });
            }
        });