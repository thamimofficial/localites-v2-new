import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../../constants/Font';
import { Localites } from '../../../Localites/Localites';
import { SafeAreaView } from 'react-native-safe-area-context';


const categories = ['Customer', 'Vendors', 'Transaction'];

const accordionData = [
  {
    id: '1',
    title: Localites.Question1,
    content: Localites.Answer1,
  },
  {
    id: '2',
    title: Localites.Question2,
    content: Localites.Answer2,
  },
  {
    id: '3',
    title: Localites.Question3,
    content: Localites.Answer3,
  },
  {
    id: '4',
    title: Localites.Question4,
    content: Localites.Answer4,
  },
  {
    id: '5',
    title: Localites.Question5,
    content: Localites.Answer5,
  },
  {
    id: '6',
    title: Localites.Question6,
    content: Localites.Answer6,
  },
  {
    id: '7',
    title: Localites.Question7,
    content: Localites.Answer7,
  },
  {
    id: '8',
    title: Localites.Question8,
    content: Localites.Answer8,
  },
  {
    id: '9',
    title: Localites.Question9,
    content: Localites.Answer9,
  },
  {
    id: '10',
    title: Localites.Question10,
    content: Localites.Answer10,
  },
];


const CustomerService = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Customer');
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState('');

  const toggleAccordion = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>FAQ</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Category Filter */}
      {/* <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* Search */}
      {/* <View style={styles.searchBox}>
        <Icon name="search" size={18} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View> */}

      {/* Accordion */}
      <ScrollView style={styles.accordionList}>
        {accordionData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => toggleAccordion(item.id)}
            style={[
              styles.accordionItem,
              expandedId === item.id && styles.accordionItemExpanded,
            ]}
          >
            <View style={styles.accordionHeader}>
              <Text
                style={[
                  styles.accordionTitle,
                  expandedId === item.id && styles.accordionTitleActive,
                ]}
              >
                {item.title}
              </Text>
              <Icon
                name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={expandedId === item.id ? '#00B050' : '#000'}
              />
            </View>
            {expandedId === item.id && (
              <Text style={styles.accordionContent}>{item.content}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
  categoryChipActive: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000',
  },
  categoryTextActive: {
    color: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f6f8',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    flex: 1,
    color: '#000',
  },
  accordionList: {
    paddingHorizontal: 16,
  },
  accordionItem: {
    backgroundColor: '#f0f6f8',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  accordionItemExpanded: {
    backgroundColor: '#e8f7ec',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: '#000',
  },
  accordionTitleActive: {
    color: '#00B050',
    fontFamily: Fonts.bold,
  },
  accordionContent: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
});

export default CustomerService;
