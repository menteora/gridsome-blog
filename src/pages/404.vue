<template>
  <Layout>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-row align="center" justify="center">
            <v-avatar size="200px">
              <g-image class="img-circle elevation-7 mb-1" src="~/assets/images/darthvader.jpg" />
            </v-avatar>
          </v-row>
          <v-row align="center" justify="center">
            <h4>
              <b>Dinamicamente.org (404)</b>
            </h4>
          </v-row>
          <v-row align="center" justify="center">
            <h6 class="text-xs-center">
              <i>I find this lack of page disturbing...</i>
            </h6>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn router exact to="/" text class="blue--text">Use the force Luke!</v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

