import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';


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

  // Verifica se todos os campos estão preenchidos
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

  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e aceite os termos.');
      return;
    }

    Alert.alert('PDF Gerado', JSON.stringify(formData));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil</Text>

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
        onPress={handleSubmit}
        disabled={!isFormValid()} // Desabilita o botão se o formulário não estiver válido
      />

      <Text style={styles.warning}>Importante! Preencha todos os campos</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#6200ea',
    padding: 15,
    marginBottom: 20,
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
    borderRadius: 5,
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
