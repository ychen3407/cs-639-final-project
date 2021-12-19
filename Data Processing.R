#input: games_processed_above_80.csv, games_processed.csv
#output: game_summary.csv, 


library(readr)
library(tidyverse)

# # Processing score vs. released_year data => bar_static (score vs. year) 
# => being updated by the interactive one below
# games <- read_csv("~/CS639/games_processed_above_80.csv")
# summary <- games%>%
#   group_by(release_year,platform)%>%
#   summarize(score = mean(meta_score))%>%
#   pivot_wider(names_from = platform, values_from = score)
# 
# write.csv(summary,file = "game_summary(score vs. year).csv") 
# # todo: replace na with 0, otherwise, can only manually be done


# ______________________________________________________________________________


# dataset for games_summary (socre vs. year) updated1.csv => bar_interactive (score vs. year)
games_full <- read_csv("~/CS639/final project/games_processed.csv")
games_summary_n_year <- games_full%>%
  filter(release_year >= 2010)%>%
  group_by(release_year,platform)%>%
  summarize(score = mean(meta_score))%>%
  pivot_wider(names_from = platform, values_from = score)

colnames(games_summary_n_year) <- c("release_year", "PC", "PlayStation4", "Xbox360")
#change colname, remove space in between, selection error in html

write.csv(games_summary_n_year,file = "games_summary (score vs. year) updated1.csv", row.names = F)


# ______________________________________________________________________________

#n (number of games) vs. released year - by platform
#TODO: Must change platform name, no space in between!!!!!
games_full <- read_csv("~/CS639/final project/games_processed.csv")
games_full$user_review = as.numeric(games_full$user_review)
games_2010 = games_full[games_full$release_year > 2010,]
games_number_year = games_2010%>%
  group_by(release_year,platform)%>%
  summarise(n = n(), .groups = 'drop')%>%
  pivot_wider(names_from = platform, values_from = n)

colnames(games_number_year) <- c("release_year", "PC", "PlayStation4", "Xbox360")

write.csv(games_number_year,file = "games_summary(n vs. year).csv")