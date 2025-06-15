import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../theme/globalStyles";

const posts = [
  {
    id: "1",
    title: "Sporten met diabetes: soms lastig, vaak geweldig",
    preview: "Bewegen is gezond, maar met diabetes komt er veel bij kijken...",
    content: `Bewegen is gezond, dat weet iedereen. Maar als je diabetes type 1 hebt, komt er nog zóveel extra bij kijken. Je moet plannen, je waardes checken, misschien iets eten voor je start, soms een pomp afkoppelen, en dan nog hopen dat je geen hypo krijgt net als je lekker bezig bent…

Toch geeft sport vaak ook een gevoel van vrijheid. Even alles vergeten, alleen maar focussen op het hier en nu. Dat lukt niet altijd, en het is oké als je daar soms stress van krijgt. Sommige jongeren stoppen (even) met sporten omdat de suikers te veel schommelen. Dat is helemaal niet raar!

Geef niet op, zoek samen naar oplossingen, en wees trots op elke stap die je zet. Misschien helpt het om je ervaringen te delen: wat doe jij als je een hypo voelt opkomen tijdens het sporten? Heb je een “go to” snack? Hoe ga je om met de onzekerheid? Deel je verhaal hieronder, zo bouwen we samen aan een sterkere community!

Let op: deze blog is geen medisch advies. Overleg bij vragen altijd met je eigen arts of diabetesverpleegkundige.`,
  },
  {
    id: "2",
    title: "Eten met diabetes: het blijft soms zoeken",
    preview: "Diabetes en voeding is elke dag een uitdaging. Je bent niet alleen!",
    content: `Diabetes type 1 en voeding zijn elke dag opnieuw een uitdaging. Soms lijkt het alsof iedereen alles kan eten zonder zorgen, terwijl jij continu moet rekenen, meten en nadenken. Je bent zeker niet alleen als je daar soms moe van wordt!

Voor veel jongeren voelt het oneerlijk dat je niet zomaar alles kan eten. Je vrienden eten op een feestje chips en snoep, en jij moet eerst even je sensor checken, een bolus geven of twijfelt: “Zal ik niet te laag gaan?” Of je wordt gek van de opmerkingen: “Jij mag dat toch niet?” terwijl je wéét dat je gewoon alles kan eten, als je maar weet hoe.

Het belangrijkste is: elke dag is anders, elk lichaam reageert anders. Wat voor jou werkt, hoeft niet voor iemand anders te werken. Geef jezelf dus de ruimte om te zoeken wat bij je past. En wees mild als het eens “misloopt” – morgen is er weer een dag.

Heb jij een gouden tip, of juist een frustratie die je wil delen? Laat het hieronder weten. Zo help je anderen en merk je: niemand doet dit alleen!

Let op: deze blog is geen medisch advies. Praat bij vragen over je voeding altijd met je eigen arts of diabetesverpleegkundige.`,
  },
  {
    id: "3",
    title: "Hypo’s: de onverwachte spelbreker",
    preview: "Ze komen vaak op het slechtste moment. Hoe ga jij ermee om?",
    content: `Iedereen met diabetes kent ze: hypo’s. Ze komen vaak op het slechtst mogelijke moment – tijdens school, sport, op een feestje, of net als je wil gaan slapen. De meeste mensen om je heen zien alleen dat je een dextro pakt, maar weten niet hoe je je écht voelt.

Een hypo kan je dag helemaal op z’n kop zetten. Soms voel je je na een hypo nog lang beroerd of verdrietig. Misschien ben je bang voor de volgende, of baal je als je weer een foutje maakte in je inschatting. Dat is heel normaal!

Besef: je bent niet de enige. Deel hieronder je meest onverwachte hypo-moment of hoe jij er weer bovenop komt. Je verhaal delen lucht vaak op en helpt anderen.

Let op: deze blog is geen medisch advies. Praat bij twijfel altijd met je arts of diabetesverpleegkundige.`,
  },
  {
    id: "4",
    title: "Hypers: het kan zomaar gebeuren",
    preview: "Een hoge bloedsuiker kan je dag flink beïnvloeden.",
    content: `Een hoge bloedsuiker kan iedereen overkomen, hoe goed je ook oplet. Soms heb je geen idee waardoor het komt, en dat is frustrerend. Je voelt je moe, snel geïrriteerd, misschien zelfs misselijk of hebt hoofdpijn.

Het lastigste is dat anderen vaak niet begrijpen hoe zwaar een hyper kan zijn. Ze zien niet dat je er de hele dag “last” van kan hebben, of dat je je zorgen maakt over wat dit betekent voor later. Je bent niet zwak als je een hyper hebt; je lichaam doet gewoon z’n ding.

Wat helpt jou om rustig te blijven bij een hyper? Deel je tips of je verhaal hieronder. Hier hoeft niemand zich te schamen!

Let op: deze blog is geen medisch advies. Praat bij twijfel altijd met je arts of diabetesverpleegkundige.`,
  },
  {
    id: "5",
    title: "Ouders en diabetes: samen leren",
    preview: "Ouders bedoelen het goed, maar botsingen zijn normaal.",
    content: `Ouders willen meestal het beste voor je, maar soms voelt het alsof ze alles controleren of te veel vragen stellen. Dat kan behoorlijk irritant zijn. Ze maken zich zorgen, maar begrijpen niet altijd wat jij voelt of nodig hebt.

Het helpt om rustig uit te leggen wat jij nodig hebt, maar dat lukt niet altijd. Weet dat het normaal is om soms botsingen te hebben. Jullie zijn samen op zoek naar een manier die voor iedereen werkt.

Wil je iets delen over jouw ouders, of heb je een tip voor anderen? Reageer gerust. Misschien lezen je ouders zelfs wel mee – samen leren we het meest!

Let op: deze blog is geen medisch advies. Praat bij twijfel altijd met je arts of diabetesverpleegkundige.`,
  },
  {
    id: "6",
    title: "Vrienden en diabetes: open kaart spelen?",
    preview: "Vertel je alles of liever niet? Beide is oké!",
    content: `Soms vertel je je vrienden alles over je diabetes, soms hou je liever iets voor jezelf. Allebei is oké! Echte vrienden staan achter je, maar misschien snappen ze niet altijd wat diabetes écht inhoudt.

Misschien heb je meegemaakt dat vrienden rare opmerkingen maken (“Je mag dat toch niet eten?”), of dat ze juist superlief helpen als je je niet goed voelt. Je hoeft je nergens voor te schamen. Elkaar uitleggen wat diabetes voor jou betekent, zorgt vaak voor meer begrip.

Hoe ga jij om met vrienden en je diabetes? Deel je ervaringen hieronder, of stel je vraag aan anderen!

Let op: deze blog is geen medisch advies. Praat bij twijfel altijd met je arts of diabetesverpleegkundige.`,
  },
  {
    id: "7",
    title: "Moeilijke dagen: je bent niet de enige",
    preview: "Je sensor valt uit, je hebt er even genoeg van. Dat mag.",
    content: `Iedereen met diabetes heeft weleens een rot-dag. Je sensor valt eraf, je bent helemaal klaar met tellen en prikken, en je suikers doen precies het tegenovergestelde van wat jij wilt. Soms wil je even niks of niemand zien.

Dat is heel normaal. Het hoort erbij, ook al zie je op social media vaak alleen de “goede” momenten van anderen. Vergelijk jezelf niet met anderen – iedereen heeft z’n eigen moeilijke dagen.

Wat helpt jou om door zo’n dag te komen? Muziek luisteren, wandelen, met iemand praten, even huilen of juist een grappig filmpje kijken? Deel het hieronder. Samen is het nét wat makkelijker.

Let op: deze blog is geen medisch advies. Praat bij twijfel altijd met je arts of diabetesverpleegkundige.`,
  },
  {
    id: "8",
    title: "Je eerste relatie met diabetes",
    preview: "Wanneer vertel je het? En hoe reageert je lief?",
    content: `Verliefd zijn is leuk, maar ook spannend met diabetes. Moet je het vertellen? Wanneer? Het belangrijkste is dat je je goed voelt bij wat je deelt. De meeste mensen reageren begripvol, zeker als je het rustig uitlegt.

Toon bijvoorbeeld je sensor of leg kort uit waarom je soms iets moet eten of meten. Als iemand echt in je leven hoort, zal hij of zij dat gewoon mee opnemen. Je hoeft je niet te verstoppen.

Let op: deze blog is geen medisch advies. Praat bij twijfel altijd met je arts of diabetesverpleegkundige.`,
  },
  {
    id: "9",
    title: "Op kamp met diabetes",
    preview: "Goed voorbereid vertrekken geeft rust en vrijheid.",
    content: `Kampen zijn geweldig om vrienden te maken, maar het vraagt wat extra voorbereiding. Neem genoeg materiaal mee: dubbel van alles (meter, strips, naalden, insuline, snacks). Maak een checklist vooraf.

Breng je leiding op de hoogte en bespreek noodgevallen. Maak eventueel een medisch fiche en voorzie een "noodpakket" dat bij een leider blijft. En vooral: geniet! Kampen zijn een mooie kans om te groeien in zelfstandigheid.

Let op: deze blog is geen medisch advies. Praat bij twijfel altijd met je arts of diabetesverpleegkundige.`,
  },
  {
    id: "10",
    title: "Diabetes & sporten op school",
    preview: "Turnen of gym met diabetes vraagt wat extra aandacht.",
    content: `Lichamelijke opvoeding op school kan extra stress geven als je diabetes hebt. Zorg dat je sportmateriaal én iets tegen hypo’s bij je hebt. Vraag je leerkracht of je sensor zichtbaar mag dragen.

Soms helpt het om vóór de les iets kleins te eten of tijdelijk je insuline aan te passen. Merk je dat je vaak in hypo gaat? Vraag hulp aan je team om je instellingen te herbekijken. Je mag meedoen, op jouw manier.

Let op: deze blog is geen medisch advies. Praat bij twijfel altijd met je arts of diabetesverpleegkundige.`,
  },
];

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const idParam = Array.isArray(id) ? id[0] : String(id);
  const post = posts.find((p) => p.id === idParam);

  if (!post) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <Text style={styles.notFoundText}>Post niet gevonden.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Terug naar overzicht</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[globalStyles.container, styles.scrollContent]}>
      <Text style={globalStyles.titleM}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  backText: {
    color: "#333",
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginTop: 12,
  },
});