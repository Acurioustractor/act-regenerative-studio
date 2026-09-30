import type { Metadata } from "next";
import { Surface } from "@/components/pieces/Surface";
import { Choice, Input, Message } from "@/components/pieces/FormFields";
import { SendButton } from "@/components/pieces/SendButton";
import { Specimen } from "../Specimen";
import styles from "../pieces.module.css";
import panel from "./forms.module.css";
import { ContactFieldsDemo, ErrorsDemo, FormSetDemo, NewsletterDemo, SentDemo } from "./FormsDemo";

export const metadata: Metadata = {
  title: "Brand v1 pieces, forms | A Curious Tractor",
  robots: { index: false, follow: false },
};

const kinds = [{ value: "general", label: "A question or something else" }];

// The form pieces, drawn once with the sample words from Pencil's board 02 (Form fields, Newsletter sign-up) and the
// contact pages (Page 03, Page 03b, Phone 03). No form here sends anything; every one stops at preventDefault.
export default function FormsPiecesPage() {
  return (
    <Surface className={`full-bleed ${styles.page}`}>
      <div className={styles.intro}>
        <h1>Forms</h1>
        <p>
          Input, Choice, Message, Send button, Newsletter sign-up and Sent, beside their Pencil nodes. Plain HTML fields:
          they take name, required, autoComplete, value and onChange as any input does. Nothing on this sheet posts.
        </p>
      </div>

      <h2 className={styles.group}>Fields</h2>
      <Specimen node="jSQEz" name="Input" width={620}>
        <Input label="Your name" name="firstName" placeholder="What should we call you?" />
      </Specimen>
      <Specimen node="ffNkC" name="Choice" width={620}>
        <Choice label="What brings you here?" name="inquiryType" prompt="Choose the closest fit" options={kinds} />
      </Specimen>
      <Specimen node="WKcpA" name="Message" width={620}>
        <Message label="What is happening?" name="message" />
      </Specimen>
      <Specimen node="G9eS6" name="Send button (the wheel rolls)" width={220}>
        <SendButton type="button">Send the question</SendButton>
      </Specimen>
      <Specimen node="G3qo9T" name="Form set" width={620}>
        <FormSetDemo />
      </Specimen>
      <Specimen node="G3qo9T-errors" name="Fields with something to say (no Pencil counterpart)" width={620}>
        <ErrorsDemo />
      </Specimen>

      <h2 className={styles.group}>In the contact panel</h2>
      <Specimen node="aIKWf" name="Contact form, desktop (Page 03)" width={560}>
        <div className={panel.panel}>
          <p className={panel.eyebrow}>Start a conversation</p>
          <h3>A little context is enough.</h3>
          <p className={panel.lead}>
            No polished brief required. Tell us what is happening, who is involved and what you are curious about.
          </p>
          <ContactFieldsDemo />
        </div>
      </Specimen>
      <Specimen node="XvoXX" name="Contact form, phone (Phone 03; shoot at 390)" width={390}>
        <div className={panel.panel}>
          <p className={panel.eyebrow}>Start a conversation</p>
          <h3>A little context is enough.</h3>
          <p className={panel.lead}>
            No polished brief required. Tell us what is happening, who is involved and what you are curious about.
          </p>
          <ContactFieldsDemo />
        </div>
      </Specimen>

      <h2 className={styles.group}>Newsletter sign-up</h2>
      <Specimen node="Agacj" name="Newsletter sign-up" width={620}>
        <NewsletterDemo />
      </Specimen>
      <Specimen node="Agacj-error" name="Newsletter sign-up with a message (no Pencil counterpart)" width={620}>
        <NewsletterDemo error="That email needs an @ and a domain." />
      </Specimen>
      <Specimen node="Agacj-480" name="Newsletter sign-up in Home's 480 column" width={480}>
        <NewsletterDemo />
      </Specimen>

      <h2 className={styles.group}>Sent</h2>
      <Specimen node="B2T5GR" name="Sent, with its ground (Page 03b; Write another plays the drive-off again)" width={1440}>
        <SentDemo />
      </Specimen>
      <Specimen node="B2T5GR-phone" name="Sent, phone (no Pencil counterpart; shoot at 390)" width={390}>
        <SentDemo />
      </Specimen>
    </Surface>
  );
}
