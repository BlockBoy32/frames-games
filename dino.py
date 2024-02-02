import pygame
import random
import sys
import csv
import os

# Initialize Pygame
pygame.init()

# Screen dimensions
screen_width = 800
screen_height = 400
screen = pygame.display.set_mode((screen_width, screen_height))

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)

# Fonts
score_font = pygame.font.SysFont('Arial', 30)
leaderboard_font = pygame.font.SysFont('Arial', 20)

# Dinosaur
dino_height = 40
dino_width = 40
dino_x = 50
dino_y = screen_height - dino_height
dino_vel = 0
gravity = 1
dino_rect = pygame.Rect(dino_x, dino_y, dino_width, dino_height)

# Obstacle
obstacle_width = 20
obstacle_height = random.randint(20, 70)
obstacle_x = screen_width
obstacle_speed = 7
obstacle_rect = pygame.Rect(obstacle_x, screen_height - obstacle_height, obstacle_width, obstacle_height)

# Game variables
clock = pygame.time.Clock()
running = True
jumping = False
score = 0
leaderboard_filename = 'leaderboard.csv'

def read_leaderboard(filename):
    try:
        with open(filename, 'r', newline='') as file:
            reader = csv.reader(file)
            return sorted([int(row[0]) for row in reader], reverse=True)[:5]
    except FileNotFoundError:
        return []

def write_score_to_leaderboard(filename, score):
    with open(filename, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([score])

def update_and_get_leaderboard(filename, score):
    write_score_to_leaderboard(filename, score)
    return read_leaderboard(filename)

def check_collision(dino_rect, obstacle_rect):
    if dino_rect.colliderect(obstacle_rect):
        return True
    return False

# Initialize leaderboard from file
leaderboard = read_leaderboard(leaderboard_filename)

# Main game loop
while running:
    screen.fill(WHITE)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and not jumping:
                jumping = True
                dino_vel = -15

    if jumping:
        dino_y += dino_vel
        dino_vel += gravity
        if dino_y >= screen_height - dino_height:
            dino_y = screen_height - dino_height
            jumping = False

    dino_rect.update(dino_x, dino_y, dino_width, dino_height)
    pygame.draw.rect(screen, BLACK, dino_rect)

    obstacle_x -= obstacle_speed
    if obstacle_x < -obstacle_width:
        obstacle_x = screen_width
        obstacle_height = random.randint(20, 70)
    obstacle_rect.update(obstacle_x, screen_height - obstacle_height, obstacle_width, obstacle_height)
    pygame.draw.rect(screen, BLACK, obstacle_rect)

    if check_collision(dino_rect, obstacle_rect):
        leaderboard = update_and_get_leaderboard(leaderboard_filename, score)
        print(f"Game Over! Final Score: {score}")
        running = False  # Stop the game loop

    # Increment score
    score += 1
    score_text = score_font.render(f"Score: {score}", True, BLACK)
    screen.blit(score_text, (10, 10))

    # Display leaderboard
    for i, top_score in enumerate(leaderboard[:5]):
        leaderboard_text = leaderboard_font.render(f"{i+1}. {top_score}", True, RED)
        screen.blit(leaderboard_text, (screen_width - 150, 10 + i * 30))

    pygame.display.update()
    clock.tick(30)



