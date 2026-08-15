import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./history.module.css";
import {
  EditorialHeader,
  PageRail,
} from "@/components/prototypes/EditorialHeader";

export const metadata: Metadata = {
  title: "The Field Between Us | A Curious Tractor",
  robots: { index: false, follow: false },
};

const bearings = [
  [
    "Before ACT",
    "Two apprenticeships",
    "A practical object opens a human relationship. A camera teaches that witnessing can also become taking.",
  ],
  [
    "31 Jul 2022",
    "The public beginning",
    "Two people, one curious tractor. Ideas, action, pride and an early promise to return the work.",
  ],
  [
    "2023-24",
    "The field widens",
    "Goods, justice, story, place and public art reveal connected questions about ownership and power.",
  ],
  [
    "2025",
    "The years of yes",
    "More than 200 actions, 29 projects and work across 17 locations make both the coherence and the cost visible.",
  ],
  [
    "2026",
    "Structure catches up",
    "The shared company, clearer decisions, sustainable revenue, family, rest and fewer deeper commitments.",
  ],
  [
    "Next",
    "From presence to transfer",
    "Capability, authority, memory and value move toward the people and places from which the work came.",
  ],
] as const;

const chapters = [
  ["01", "Restlessness"],
  ["02", "The tractor"],
  ["03", "The years of yes"],
  ["04", "Country"],
  ["05", "Story"],
  ["06", "Justice"],
  ["07", "Hospitality"],
  ["08", "Art"],
  ["09", "Memory"],
  ["10", "Partnership"],
] as const;

function Chapter({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.chapter}>
      <aside>
        <span>{number}</span>
        <p>{eyebrow}</p>
      </aside>
      <div>
        <h2>{title}</h2>
        <div className={styles.prose}>{children}</div>
      </div>
    </section>
  );
}

export default function FieldHistoryPrototype() {
  return (
    <article className={styles.history}>
      <EditorialHeader />
      <PageRail
        label="The field between us"
        links={[
          ["History", "#history"],
          ["Convictions", "#convictions"],
          ["Bearings", "#bearings"],
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            A founders&apos; history · the work so far
          </p>
          <h1>
            The field
            <br />
            between us.
          </h1>
          <p>
            Two people, one curious tractor, and the long work of learning what
            to build, what to hold and what to give away.
          </p>
          <a href="#history">Begin before the tractor ↓</a>
        </div>
        <div className={styles.heroMedia}>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/media/field-stills/hero-farm-aerial.jpg"
          >
            <source
              src="/media/field-videos/hero-farm-aerial.mp4"
              type="video/mp4"
            />
          </video>
          <span>Place teaches the work</span>
        </div>
      </section>

      <section className={styles.note}>
        <p>This is not a company story in which the company is the hero.</p>
        <div>
          <p>
            It is a record of two people learning that the worth of a tool is
            measured by what it allows other people to hold, and that the
            deepest work of building is often the work of becoming less
            necessary.
          </p>
          <p>
            Some parts of this history belong in public. Some remain inside
            relationships, permissions and cultural authority. This page will
            keep that boundary visible.
          </p>
          <p>
            A Curious Tractor is not a First Nations organisation and does not
            speak as one. When we are invited into work with First Nations
            communities, our responsibility is to follow community authority, be
            clear about what we hold, and accept correction, refusal and silence
            as part of the work. A relationship is not consent in perpetuity. A
            good history together does not turn the next visit into an
            entitlement.
          </p>
        </div>
      </section>

      <nav className={styles.chapterIndex} aria-label="History chapters">
        <p>Ten turns in the field</p>
        <ol>
          {chapters.map(([number, label]) => (
            <li key={number}>
              <span>{number}</span>
              {label}
            </li>
          ))}
        </ol>
      </nav>

      <div id="history">
        <Chapter
          number="01"
          eyebrow="Before the tractor"
          title="Two kinds of restlessness."
        >
          <p>
            Nic learned early through tools, movement and making. At nineteen,
            an old van became a mobile washing service for people experiencing
            homelessness. The machine mattered, but the larger discovery was the
            room that opened around it: chairs, time, conversation and the
            dignity of being met without a counter between you.
          </p>
          <p>
            Ben arrived by another road: Muswellbrook on Wanaruah Country,
            travel, youth work, remote community programs, prisons, young
            people in care and photography. The camera opened rooms, but it also carried a problem
            that would shape the next decade. An image can witness a person, and
            it can take from them. The difference is the relationship around it.
          </p>
          <p>
            At Orange Sky their paths converged. One had learned that a machine
            could make human space. The other was learning that an image must
            listen before it speaks. Both were impatient with the distance
            between a good intention and something a person could touch.
          </p>
        </Chapter>

        <section className={styles.pullQuote}>
          <p>Are you proud of it?</p>
          <span>The question that travelled further than any framework.</span>
        </section>

        <Chapter
          number="02"
          eyebrow="31 July 2022"
          title="Two people, one curious tractor."
        >
          <p>
            The first public account of A Curious Tractor appeared under the
            words &quot;Irrigation, seeds and ACTion.&quot; Centre-pivot
            irrigation machines traced enormous circles across the Great Plains.
            Ordinary materials, arranged differently, could alter what a field
            was capable of becoming.
          </p>
          <p>
            The beginning carried bright voltage. ACT would walk beside people,
            help ideas take form and gift the work back. The early language
            trusted innovation, impact and scale. It had not yet learned to
            speak precisely about authority, consent, cultural governance, local
            production or the economy left behind after a project vehicle
            leaves.
          </p>
          <p>
            Still, the later ethic was already present in the promise to return
            the work. The company began by asking how to give an idea force. The
            field taught a harder question: whose force is it, and where should
            it live when we are gone?
          </p>
        </Chapter>

        <section className={styles.imageBreak}>
          <Image
            src="/media/field-stills/goods-community-aerial.jpg"
            alt="Goods on Country field work viewed from above"
            fill
            sizes="100vw"
          />
          <p>The archive reads less like a business plan than a weather map.</p>
        </section>

        <Chapter
          number="03"
          eyebrow="The years of yes"
          title="We could feel the coherence before we could explain it."
        >
          <p>
            Beds assembled in the Centre. Photo kiosks on Bwgcolman (Palm
            Island). Story circles. A ledger for consent. JusticeHub demos.
            Public artworks. Farm workshops. Gardens, data maps, caravans and
            shipping containers cut open and rebuilt.
          </p>
          <p>
            By the end of 2025, one record held more than two hundred actions,
            twenty-nine projects and work across seventeen locations. Another
            planning page counted thirty-six active projects. Those numbers do
            not prove importance. They prove appetite.
          </p>
          <p>
            The abundance carried a risk. An organisation that gathers worthy
            projects can become the centre of a world it claims to decentralise.
            Care without limit can become another form of carelessness. The work
            needed a spine, and the founders needed a limit.
          </p>
        </Chapter>

        <section className={styles.fieldFilm}>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/media/field-stills/goods-community-build.jpg"
          >
            <source
              src="/media/field-videos/goods-community-build.mp4"
              type="video/mp4"
            />
          </video>
          <div>
            <span>Hands before claims</span>
            <p>The object enters the room. Then the real questions begin.</p>
          </div>
        </section>

        <Chapter
          number="04"
          eyebrow="What Country corrected"
          title="Relationship is not a distribution route."
        >
          <p>
            Goods on Country made the correction tangible. A better bed matters.
            So does a washing machine designed for heat, hard water, distance,
            repair and real use. But a durable product can still participate in
            an extractive economy.
          </p>
          <p>
            If decisions, machinery, wages, data, margin and authority leave on
            the same truck that delivered the object, the object has improved
            while the pattern remains. The work must follow value all the way
            home: what arrives, what leaves, what remains and who decides what
            happens next.
          </p>
          <p>
            The people and organisations who opened the roads were not a
            distribution network. They were the authority that made the work
            possible. Relationship is the ground on which an idea is allowed to
            change.
          </p>
          <Link href="/fields/goods">Follow the Goods on Country story →</Link>
        </Chapter>

        <section className={styles.dualMedia}>
          <Image
            src="/media/field-stills/palm-island-coastline.jpg"
            alt="Bwgcolman (Palm Island) coastline"
            fill
            sizes="50vw"
          />
          <Image
            src="/media/field-stills/empathy-ledger-elder-trip.jpg"
            alt="Documentary landscape from Empathy Ledger field work"
            fill
            sizes="50vw"
          />
        </section>

        <Chapter
          number="05"
          eyebrow="The story must come home"
          title="The storyteller remains the source."
        >
          <p>
            Every photograph carries a quiet question. After an image travels
            into a report, a funding room, a newspaper or a website, what
            returns to the person whose life made it valuable?
          </p>
          <p>
            On Bwgcolman (Palm Island), a photo kiosk and locally held server
            began to make a different relationship physical. Empathy Ledger
            extended the question into infrastructure. Consent could remain
            alive, specific to each use, capable of being changed and capable of
            being withdrawn.
          </p>
          <p>
            The story does not belong to the pipe merely because the pipe
            carried it. Technology can remember an obligation. It cannot become
            the source of authority.
          </p>
          <Link href="/fields/empathy">Follow the Empathy Ledger story →</Link>
        </Chapter>

        <section className={styles.darkEncounter}>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/media/field-stills/contained-aerial.jpg"
          >
            <source
              src="/media/field-videos/contained-aerial.mp4"
              type="video/mp4"
            />
          </video>
          <div>
            <p className={styles.eyebrow}>Justice · story · art</p>
            <h2>The platform is not the fire.</h2>
            <p>
              Community remains the fire. Our responsibility is to tend the
              connections around it and know when the machinery is too loud.
            </p>
          </div>
        </section>

        <section
          className={styles.permissionBoundary}
          aria-label="Story permission boundary"
        >
          <div>
            <span>06 · The Fire and the Road</span>
            <p>Story space held open</p>
          </div>
          <div>
            <h2>
              A place in the history.
              <br />
              No borrowed image.
            </h2>
            <p>
              Jeremy Donovan&apos;s teaching belongs in the justice chapter. His
              photographs and recorded voice do not move into this page until
              Jeremy&apos;s review, Elder and community review, and the consent
              record agree.
            </p>
            <Link href="/fields/justice">Enter the justice field →</Link>
          </div>
        </section>

        <Chapter
          number="06"
          eyebrow="Justice, fire and the room you can enter"
          title="The missing thing was connective tissue."
        >
          <p>
            JusticeHub began because the same truth kept appearing in different
            places. Communities already held answers, but those answers were
            isolated from one another and from the rooms where money, policy and
            public stories were decided.
          </p>
          <p>
            In the East Kimberley, Jeremy Donovan’s teaching beside biri, the
            fire, offers a grounded philosophy of justice: see beauty before
            behaviour, tend force rather than extinguish spirit, and let
            Country, Culture, kinship and responsibility become anchors. His
            story must be published in his voice, with cultural terms,
            quotations and images confirmed before release.
          </p>
          <p>
            CONTAINED carries the argument into an object. A shipping container
            becomes a public artwork people can enter. The system is no longer
            explained at a safe distance. It becomes a threshold crossed by the
            body.
          </p>
          <Link href="/fields/justice">Follow the JusticeHub story →</Link>
        </Chapter>

        <Chapter
          number="07"
          eyebrow="The kettle, table and land"
          title="Hospitality is infrastructure."
        >
          <p>
            Nic’s part of the work resists the fantasy that change occurs only
            through strategy, software or policy. His materials are often
            humbler: a kettle, a table, a tool, a room, a garden, food at the
            right moment and the repair that tells a person somebody expected
            them to stay.
          </p>
          <p>
            At Black Cockatoo Valley and The Harvest, place is not scenery.
            Place is one of the ways the work thinks. A garden, kitchen, art
            space and long table lower the threshold at which a stranger can
            become a participant.
          </p>
          <p>
            The romantic version of place forgets rates, rosters, insurance,
            repairs and who washes the plates. Care that cannot endure becomes a
            beautiful weekend somebody else must clean up.
          </p>
          <Link href="/fields/harvest">Follow The Harvest story →</Link>
        </Chapter>

        <section className={`${styles.fieldFilm} ${styles.fieldFilmRight}`}>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/media/field-stills/harvest-witta-aerial.jpg"
          >
            <source
              src="/media/field-videos/harvest-witta-aerial.mp4"
              type="video/mp4"
            />
          </video>
          <div>
            <span>The Harvest</span>
            <p>
              A table is small architecture. Who can reach it changes the room.
            </p>
          </div>
        </section>

        <section className={styles.imageBreak}>
          <Image
            src="/media/field-stills/harvest-witta-aerial-3.jpg"
            alt="The Harvest in Witta viewed from above"
            fill
            sizes="100vw"
          />
          <p>Some work needs a table, a garden and time.</p>
        </section>

        <Chapter
          number="08"
          eyebrow="Art was never the fourth step"
          title="Art is a form of moral attention."
        >
          <p>
            Listen · Curiosity · Action · Art gave the scattered work a spine.
            It becomes false when treated as a production line. Listening does
            not end when curiosity begins. Action can be the decision to wait,
            return or refuse. Art is present in the first act of attention.
          </p>
          <p>
            Art keeps different truths in the same body: the bed and the economy
            behind it; the young person and the file written about them; the
            story and the consent that governs it; the generous room and the
            labour required to hold it open.
          </p>
          <p>
            ACT is not an arts organisation with social projects beneath it, or
            a consultancy that sometimes uses art. Art is the connective tissue
            between what a system says it does and what a person feels it doing.
          </p>
          <Link href="/art">Enter the art →</Link>
        </Chapter>

        <Chapter
          number="09"
          eyebrow="Systems that remember"
          title="Automate administration, not relationship."
        >
          <p>
            A ledger, evidence base, asset register or digital platform can help
            knowledge travel without being lost. It can also become a mine. A
            dashboard can make what is easy to count appear more real than what
            takes years to understand.
          </p>
          <p>
            The answer is not to refuse machinery. It is to make machinery
            remember its obligations. Let it carry receipts, reminders, version
            histories and the memory of promises. Do not ask it to conduct
            ceremony, resolve cultural authority, repair trust or decide what a
            story means to the person who lived it.
          </p>
          <p>
            The machine belongs behind the house. People belong at the table and
            the fire.
          </p>
        </Chapter>

        <Chapter
          number="10"
          eyebrow="Two different instruments"
          title="The partnership is strongest when neither man wins."
        >
          <p>
            Ben reaches for story, systems, evidence, justice and the
            infrastructure that lets knowledge move. Nic reaches for place,
            people, art, hospitality and the practical gesture that changes the
            feeling in a room.
          </p>
          <p>
            Without Ben, lived detail may fail to travel into rooms of policy,
            money and evidence. Without Nic, a system may confuse legibility
            with truth. One brings the ledger toward the fire. The other keeps
            the fire from becoming a line in the ledger.
          </p>
          <p>
            Speed must answer to season. System must answer to place. Proof must
            answer to trust. Imagination must answer to maintenance. The
            friction is not an inconvenience to remove. It is one of ACT’s
            instruments of truth.
          </p>
        </Chapter>
      </div>

      <section id="convictions" className={styles.convictions}>
        <p className={styles.eyebrow}>What we now believe</p>
        <h2>Seven convictions for the next field.</h2>
        {[
          [
            "Begin with presence",
            "Look for relationship, memory, humour, skill, cultural authority and ambition before defining a place by absence.",
          ],
          [
            "Let relationship alter the design",
            "If the object, contract, timetable or governance cannot change, listening has become consultation theatre.",
          ],
          [
            "Follow value all the way home",
            "Ask where wages, margin, machinery, data, rights, decisions and reputation come to rest.",
          ],
          [
            "Treat story as sacred trust",
            "Consent is alive, specific and reversible. Cultural knowledge remains governed by its people.",
          ],
          [
            "Use art as a way of knowing",
            "Art lets systems become felt and keeps contradiction visible.",
          ],
          [
            "Build every tool with a door out",
            "Transfer knowledge, infrastructure, capability and decisions. Being needed forever is not impact.",
          ],
          [
            "Protect the capacity to return",
            "Rest, family, health, clean books and disciplined refusal are part of keeping faith.",
          ],
        ].map(([title, body], index) => (
          <div key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </section>

      <section id="bearings" className={styles.bearings}>
        <p className={styles.eyebrow}>Historical bearings</p>
        <h2>A chronology of becoming.</h2>
        {bearings.map(([when, turning, changed]) => (
          <div key={when}>
            <time>{when}</time>
            <h3>{turning}</h3>
            <p>{changed}</p>
          </div>
        ))}
      </section>

      <section className={styles.close}>
        <p>Are you proud of it?</p>
        <h2>
          Not yet. Go back.
          <br />
          Come closer. Listen again.
        </h2>
        <div>
          <Link href="/">Return to the living field →</Link>
          <Link href="/contact">Bring us a question →</Link>
        </div>
      </section>

      <footer className={styles.sourceNote}>
        This living history draws from &quot;The Field Between Us&quot;,
        ACT&apos;s project archive and the yearly reviews. Some stories remain
        inside relationships, permissions and cultural authority. That boundary
        is part of the record.
      </footer>
    </article>
  );
}
