import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import jsPDF from 'jspdf';

interface FormData {
  nome: string;
  email: string;
  endereco: string;
  dataNascimento: string;
  telefone: string;
  termosAceitos: boolean;
}

const Formulario: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    endereco: '',
    dataNascimento: '',
    telefone: '',
    termosAceitos: false,
  });

  const handleInputChange = (name: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const formatDataNascimento = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, '');

    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const handleDataNascimentoChange = (text: string) => {
    const formatted = formatDataNascimento(text);
    handleInputChange('dataNascimento', formatted);
  };

  const calculateAge = (dataNascimento: string): number => {
    const [day, month, year] = dataNascimento.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day); // Mês é 0-indexado
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // Ajusta a idade se ainda não tiver feito aniversário este ano
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const isFormValid = () => {
    const { nome, email, endereco, dataNascimento, telefone, termosAceitos } = formData;
    return (
      nome.trim() !== '' &&
      email.trim() !== '' &&
      endereco.trim() !== '' &&
      dataNascimento.trim() !== '' &&
      telefone.trim() !== '' &&
      termosAceitos
    );
  };

  const generatePDF = () => {
    if (!isFormValid()) {
      alert('Por favor, preencha todos os campos e aceite os termos.');
      return;
    }

    const idade = calculateAge(formData.dataNascimento); // Calcula a idade
    const pdf = new jsPDF();
    const pdfContent = `
      DECLARAÇÃO

      Eu me chamo ${formData.nome},

      tenho ${idade} anos.

      Moro no seguinte endereço ${formData.endereco}.

      Meus contatos:

      email: ${formData.email}

      Telefone: ${formData.telefone}
    `;

    // Adiciona texto ao PDF
    pdf.text(pdfContent, 10, 10);
    
    // Salva o PDF
    pdf.save('perfil_dados.pdf');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={formData.nome}
          onChangeText={(text) => handleInputChange('nome', text)}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          keyboardType="email-address"
          onChangeText={(text) => handleInputChange('email', text)}
        />

        <Text style={styles.label}>Endereço:</Text>
        <TextInput
          style={styles.input}
          value={formData.endereco}
          onChangeText={(text) => handleInputChange('endereco', text)}
        />

        <Text style={styles.label}>Data de Nascimento (DD/MM/AAAA):</Text>
        <TextInput
          style={styles.input}
          value={formData.dataNascimento}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={handleDataNascimentoChange}
        />

        <Text style={styles.label}>Telefone:</Text>
        <TextInput
          style={styles.input}
          value={formData.telefone}
          keyboardType="phone-pad"
          onChangeText={(text) => handleInputChange('telefone', text)}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={formData.termosAceitos ? 'checked' : 'unchecked'}
            onPress={() => handleInputChange('termosAceitos', !formData.termosAceitos)}
          />
          <Text>Aceito os termos</Text>
        </View>

        <Button
          title="Gerar PDF"
          onPress={generatePDF}
          disabled={!isFormValid()}
          color="#685FE9" // Cor de fundo roxo do botão
        />
      </View>

      <Text style={styles.warning}>Importante! Preencha todos os campos</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#d3d3d3', // Fundo cinza claro
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#685FE9', // Fundo roxo claro #685FE9
    padding: 15,
    borderRadius: 10, // Borda arredondada
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#fff', // Fundo branco para o formulário
    padding: 20,
    borderRadius: 10, // Borda arredondada
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10, // Borda arredondada
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  warning: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default Formulario;
