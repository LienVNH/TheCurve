import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";
import { useRouter } from "expo-router";
import Header from "../../components/UI/Header";

export default function TermsScreen() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Header variant="default" />
      <View style={[globalStyles.container, styles.wrapper]}>
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Terug</Text>
          </TouchableOpacity>
        </View>

        <Text style={globalStyles.titleM}>Algemene Voorwaarden</Text>

        <Section title="1. Toepasselijkheid & updates">
          Door gebruik te maken van deze app ga je akkoord met deze voorwaarden. Wij behouden ons het recht voor om de inhoud van deze voorwaarden op
          elk moment te wijzigen. Raadpleeg deze pagina regelmatig.
        </Section>

        <Section title="2. GDPR & gegevensbescherming">
          Wij respecteren de GDPR. Persoonlijke gegevens worden alleen gebruikt voor de werking van deze app en worden niet gedeeld met derden zonder
          jouw toestemming, behalve indien wettelijk vereist.
        </Section>

        <Section title="3. Leeftijdsrestrictie">
          Deze app is bedoeld voor jongeren vanaf 13 jaar. Ben je jonger, gebruik dan enkel onder toezicht van een ouder of voogd.
        </Section>

        <Section title="4. Geen medische app">
          Deze app biedt géén medisch advies. Bij gezondheidsproblemen of vragen raden we aan om een verpleegkundige of arts te raadplegen.
        </Section>

        <Section title="5. Gedragsregels & rapportage">
          We verwachten respect voor alle gebruikers. Discriminatie, haatspraak, pesten of ongepaste inhoud wordt niet getolereerd. Meld wangedrag via
          het uitroepteken in de header of via onderstaande contactgegevens:
          {"\n\n"}Lien Vannieuwenhuyse
          {"\n"}Aalstsesteenweg 92
          {"\n"}9506 Schendelbeke, België
          {"\n"}Kolibrievnh@gmail.com
        </Section>

        <Section title="6. Aansprakelijkheid">
          De makers van deze app kunnen niet verantwoordelijk worden gesteld voor enige schade, gevolgschade of beslissingen genomen op basis van de
          inhoud van deze app. Gebruik is op eigen risico.
        </Section>

        <Section title="7. Inhoud door gebruikers">
          Gebruikers zijn verantwoordelijk voor de inhoud die zij delen. De makers behouden zich het recht voor om ongepaste berichten zonder
          verwittiging te verwijderen.
        </Section>

        <Section title="8. Intellectuele eigendom">
          Alle inhoud in deze app ( teksten, logo's, illustraties, functionaliteit ) is auteursrechtelijk beschermd. Niets mag gekopieerd of verspreid
          worden zonder schriftelijke toestemming van de makers.
        </Section>

        <Section title="9. Externe links">
          Deze app kan links bevatten naar externe websites. Wij zijn niet verantwoordelijk voor de inhoud of privacypraktijken van die websites.
        </Section>

        <Section title="10. Wijzigingen aan de service">
          Wij behouden het recht om de app geheel of gedeeltelijk te wijzigen, te onderbreken of stop te zetten, zonder voorafgaande verwittiging.
        </Section>

        <Section title="11. Toepasselijk recht">
          Deze voorwaarden worden beheerst door het Belgisch recht. Geschillen worden voorgelegd aan de bevoegde rechtbanken van Oudenaarde.
        </Section>

        <Section title="12. Contact">
          Voor vragen over deze voorwaarden of je privacy kan je contact opnemen met:
          {"\n\n"}Lien Vannieuwenhuyse
          {"\n"}Aalstsesteenweg 92
          {"\n"}9506 Schendelbeke, België
          {"\n"}Kolibrievnh@gmail.com
        </Section>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.paragraph}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  
  backButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  
  backText: {
    color: theme.colors.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textDark,
  },
});
