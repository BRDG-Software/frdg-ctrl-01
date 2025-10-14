extern bool debugPrint;
extern int caseID_in, shelfID_in, ledID_in, rgb_in[];
extern char ledTYPE_in;

int process_subMSG(char inputty[], int beginning) {
  char pre[] = "0.00";
  pre[0] = inputty[beginning];
  pre[2] = inputty[beginning+1];
  pre[3] = inputty[beginning+2];
  float val = atof(pre);
  int outputty = int(val*100);
  return outputty;
}

void print_it(String inputty) {
  if (debugPrint == true) {
    Serial.println(inputty);
  }
}

void print_message_parsed() {
  if (debugPrint == true) {
    Serial.print("case id: ");
    Serial.print(caseID_in); Serial.print(" | ");
    Serial.print("shelf id: ");
    Serial.print(shelfID_in); Serial.print(" | ");
    Serial.print(" led type: ");
    Serial.print(ledTYPE_in); Serial.print(" | ");
    Serial.print(" led id: ");
    Serial.print(ledID_in); Serial.print(" | ");
    Serial.print(" led value: ");
    Serial.print(rgb_in[0]); Serial.print(",");
    Serial.print(rgb_in[1]); Serial.print(",");
    Serial.println(rgb_in[2]);
  }
}
